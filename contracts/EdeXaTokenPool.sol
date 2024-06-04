// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@wandevs/message/contracts/app/WmbApp.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EdexaTokenPool is WmbApp {
    using SafeERC20 for IERC20;
    address public poolToken;

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

    constructor(
        address _admin,
        address _wmbGateway,
        address _poolToken
    ) WmbApp() {
        initialize(_admin, _wmbGateway);
        poolToken = _poolToken;
    }

    function configRemotePool(
        uint256 chainId,
        address remotePool
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        remotePools[chainId] = remotePool;
    }

    function crossTo(
        uint256 toChainId,
        address to,
        uint256 amount
    ) public payable {
        require(
            remotePools[toChainId] != address(0),
            "remote pool not configured"
        );

        IERC20(poolToken).safeTransferFrom(msg.sender, address(this), amount);

        uint fee = estimateFee(toChainId, 800_000);

        _dispatchMessage(
            toChainId,
            remotePools[toChainId],
            abi.encode(msg.sender, to, amount, "crossTo"),
            fee
        );

        emit CrossRequest(toChainId, msg.sender, to, amount);
    }

    // Transfer in enough native coin for fee.
    receive() external payable {}

    function _wmbReceive(
        bytes calldata data,
        bytes32 /*messageId*/,
        uint256 fromChainId,
        address fromSC
    ) internal override {
        (
            address fromAccount,
            address to,
            uint256 amount,
            string memory crossType
        ) = abi.decode(data, (address, address, uint256, string));
        if (IERC20(poolToken).balanceOf(address(this)) >= amount) {
            IERC20(poolToken).safeTransfer(to, amount);
            emit CrossArrive(fromChainId, fromAccount, to, amount, crossType);
        } else {
            if (keccak256(bytes(crossType)) == keccak256("crossTo")) {
                uint fee = estimateFee(fromChainId, 400_000);
                _dispatchMessage(
                    fromChainId,
                    fromSC,
                    abi.encode(to, fromAccount, amount, "crossRevert"),
                    fee
                );
                emit CrossRevert(fromChainId, fromAccount, to, amount);
            } else {
                revert RevertFailed(fromAccount, to, amount, fromChainId);
            }
        }
    }
}
