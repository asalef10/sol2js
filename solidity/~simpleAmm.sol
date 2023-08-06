// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/~IERC20.sol";
import "@openzeppelin/contracts/utils/math/~SafeMath.sol";


contract AMMcontract {
    address public tokenAAddress;
    address public tokenBAddress;
    address public registryAddress;

   using SafeMath for uint256;

    constructor(address _tokenA, address _tokenB) {
        require(
            _tokenA != address(0) && _tokenB != address(0),
            "invalid token address"
        );
        tokenAAddress = _tokenA;
        tokenBAddress = _tokenB;
        registryAddress = msg.sender;
    }

    function quote(
        uint256 amountA,
        uint256 balanceA,
        uint256 balanceB
    ) internal pure returns (uint256 amountB) {
        require(amountA > 0, " INSUFFICIENT_AMOUNT");
        require(balanceA > 0 && balanceB > 0, " INSUFFICIENT_LIQUIDITY");
        amountB = (amountA * balanceB) / balanceA;
    }

function addLiquidity(
    uint256 amountADesired,
    uint256 amountBDesired
) public returns (uint256 amountA, uint256 amountB) {
    uint256 reserveA;
    uint256 reserveB;

    (reserveA, reserveB) = getReserves();

    if (reserveA == 0 && reserveB == 0) {
        (amountA, amountB) = (amountADesired, amountBDesired);
    } else {
        uint256 amountBOptimal = quote(amountADesired, reserveA, reserveB);

        if (amountBOptimal <= amountBDesired) {
            (amountA, amountB) = (amountADesired, amountBOptimal);
        } else {
            uint256 amountAOptimal = quote(amountBDesired, reserveB, reserveA);

            require(amountAOptimal <= amountADesired, "Too much token A desired");

            (amountA, amountB) = (amountAOptimal, amountBDesired);
        }
        uint256 currentRatio = reserveA.mul(1e18).div(reserveB);
        uint256 addedRatio = amountA.mul(1e18).div(amountB);
        require(addedRatio == currentRatio, "Provided liquidity does not maintain current pool ratio");
    }

     IERC20(tokenAAddress).transferFrom(msg.sender, address(this), amountA);
    IERC20(tokenBAddress).transferFrom(msg.sender, address(this), amountB);

    return (amountA, amountB);
}


    function tokenToTokenSwap(address inputToken, address outputToken, uint256 inputAmount) public {
    require(inputToken != outputToken, "Input and output tokens must be different");

    uint256 inputReserve;
    uint256 outputReserve;

    (inputReserve, outputReserve) = getReserves();

     uint256 outputAmount = quote(inputAmount, inputReserve, outputReserve);

     IERC20(inputToken).transferFrom(msg.sender, address(this), inputAmount);

     IERC20(outputToken).transfer(msg.sender, outputAmount);
}



    function getReserves() public view returns (uint256, uint256) {
        uint256 reserveA = IERC20(tokenAAddress).balanceOf(address(this));
        uint256 reserveB = IERC20(tokenBAddress).balanceOf(address(this));
        return (reserveA, reserveB);
    }

    

    function getReserve() public view returns (uint256) {
        return
            IERC20(tokenAAddress).balanceOf(address(this)) +
            IERC20(tokenBAddress).balanceOf(address(this));
    }

    function getReserveA() public view returns (uint256) {
        return IERC20(tokenAAddress).balanceOf(address(this));
    }

    function getReserveB() public view returns (uint256) {
        return IERC20(tokenBAddress).balanceOf(address(this));
    }

 
}
