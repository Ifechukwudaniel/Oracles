// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol';
import '@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol';
import "hardhat/console.sol";

contract Transactions is IERC721Receiver, PeripheryImmutableState {

    address deployer;

    address public constant Router = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // the router contract address
    address public constant factoryAdd = 0x1F98431c8aD98523631AE4a59f267346ea31F984; //the factory contract address
    address public constant usdtAddress = 0x1F98431c8aD98523631AE4a59f267346ea31F984; // (look for usdt on mumbai)

    address public constant _WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    
    ISwapRouter public constant swapRouter = ISwapRouter(Router);
    INonfungiblePositionManager public constant nonfungiblePositionManager = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);

    struct Deposit {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }

    mapping(uint256 => Deposit) public deposits;

    // We set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor() PeripheryImmutableState(factoryAdd, _WETH9) {
    }

    function onERC721Received(
        address operator,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        // get position information
        _createDeposit(operator, tokenId);
        return this.onERC721Received.selector;
    }

    function _createDeposit(address owner, uint256 tokenId) internal {
        (, , address token0, address token1, , , , uint128 liquidity, , , , ) =
            nonfungiblePositionManager.positions(tokenId);

        // set the owner and data for position
        // operator is msg.sender
        deposits[tokenId] = Deposit({owner: owner, liquidity: liquidity, token0: token0, token1: token1});

        console.log('liquidity', liquidity);
        console.log('tokenId', tokenId);
    }
    /// @notice Calls the mint function defined in periphery, mints the same amount of each token. For this example we are providing 1000 DAI and 1000 USDC in liquidity
    /// @return tokenId The id of the newly minted ERC721
    /// @return liquidity The amount of liquidity for the position
    /// @return amount0 The amount of token0
    /// @return amount1 The amount of token1
    function mintNewPosition(
        address token0,
        address token1,
        uint _amount0,
        uint _amount1,
        address receiver
    )
        external
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {

        uint256 amount0ToMint = _amount0;
        uint256 amount1ToMint = _amount1;

        // Approve the position manager
        TransferHelper.safeApprove(token0, address(nonfungiblePositionManager), amount0ToMint);
        TransferHelper.safeApprove(token1, address(nonfungiblePositionManager), amount1ToMint);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: poolFee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: receiver,
                deadline: block.timestamp
            });

        // Note that the pool defined by DAI/USDC and fee tier 0.3% must already be created and initialized in order to mint
        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(params);

        // Create a deposit
        _createDeposit(msg.sender, tokenId);

        // Remove allowance and refund in both assets.
        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), 0);
            uint256 refund0 = amount0ToMint - amount0;
            TransferHelper.safeTransfer(DAI, msg.sender, refund0);
        }

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(USDC, address(nonfungiblePositionManager), 0);
            uint256 refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(USDC, msg.sender, refund1);
        }
    }

    // function to buy tokens using uniswap
    function buyToken (
        // the token the user is buying
        address assetToken,
        // the amount the user is purchasing in (preferably USDT)
        uint amount,
        // the receivers address i.e the users' address
        address receiver
        ) public returns(uint amountOut) {
        
        TransferHelper.safeTransferFrom(usdtAddress, msg.sender, address(this), amount);
        TransferHelper.safeApprove(usdtAddress, address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: usdtAddress,
                tokenOut: assetToken,
                fee: poolFee,
                recipient: receiver,
                deadline: block.timestamp + 50,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap and gets the amount paid to the receiver.
        amountOut = swapRouter.exactInputSingle(params);      
    }

    function sellToken (
        // the token the user is selling
        address assetToken,
        // the amount the user intends to sell
        uint amount,
        // the receivers address i.e the users' address
        address receiver
        ) public returns(uint amountOut) {
        
        TransferHelper.safeTransferFrom(assetToken, msg.sender, address(this), amount);
        TransferHelper.safeApprove(assetToken, address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: assetToken,
                tokenOut: usdtAddress,
                fee: poolFee,
                recipient: receiver,
                deadline: block.timestamp + 50,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap and gets the amount paid to the receiver.
        amountOut = swapRouter.exactInputSingle(params);     
    }
}