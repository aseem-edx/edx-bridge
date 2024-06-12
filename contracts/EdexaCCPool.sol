// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@wandevs/message/contracts/app/WmbApp.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EdexaCCPool is WmbApp {
    using SafeERC20 for IERC20;
    address public token;

    // chain id => remote pool address
    mapping(uint => address) public remotePools;

    event CrossArrive(
        uint256 indexed fromChainId,
        address indexed from,
        address indexed to,
        uint256 amount,
        string crossType
    );

    event CrossRequest(
        uint256 indexed toChainId,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    event CrossRevert(
        uint256 indexed fromChainId,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    error RevertFailed(
        address from,
        address to,
        uint256 amount,
        uint256 fromChainId
    );

    constructor(address _wmbGateway, address _token) WmbApp() {
        initialize(msg.sender, _wmbGateway);
        token = _token;
    }

    function configRemotePool(
        uint256 _chainId,
        address _remotePool
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        remotePools[_chainId] = _remotePool;
    }

    function crossTo(
        uint256 _toChainId,
        address _to,
        uint256 _amount
    ) public payable {
        require(
            remotePools[_toChainId] != address(0),
            "remote pool not configured"
        );

        IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);

        uint fee = estimateFee(_toChainId, 800_000);

        _dispatchMessage(
            _toChainId,
            remotePools[_toChainId],
            abi.encode(msg.sender, _to, _amount, "crossTo"),
            fee
        );

        emit CrossRequest(_toChainId, msg.sender, _to, _amount);
    }

    // Transfer in enough native coin for fee.
    receive() external payable {}

    function _wmbReceive(
        bytes calldata _data,
        bytes32 /*messageId*/,
        uint256 _fromChainId,
        address _fromSC
    ) internal override {
        (
            address fromAccount,
            address to,
            uint256 amount,
            string memory crossType
        ) = abi.decode(_data, (address, address, uint256, string));
        if (IERC20(token).balanceOf(address(this)) >= amount) {
            IERC20(token).safeTransfer(to, amount);
            emit CrossArrive(_fromChainId, fromAccount, to, amount, crossType);
        } else {
            if (keccak256(bytes(crossType)) == keccak256("crossTo")) {
                uint fee = estimateFee(_fromChainId, 400_000);
                _dispatchMessage(
                    _fromChainId,
                    _fromSC,
                    abi.encode(to, fromAccount, amount, "crossRevert"),
                    fee
                );
                emit CrossRevert(_fromChainId, fromAccount, to, amount);
            } else {
                revert RevertFailed(fromAccount, to, amount, _fromChainId);
            }
        }
    }
}
