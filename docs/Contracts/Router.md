# Router Smart Contract API

Routers are stateless and are boun to change over time. We may change it if there is need for more functionality or a better smart contract pattern is discovered.

## Code
The code to the Router.sol file can be found here.
N.B To be updated when I confirm the link to the final repo.

## Networks and Address

| Network | Address |
|---------|---------|
|Mainnet  | <Placeholder> |
|Rospen   |               |
|Rinkeby  |               |
|Görli    |               |
|Kovan    |               |

## Functions

### factory
Returns the address to the factory smart contract
```solidity
function factory() public view returns (address)
```

### WETH
Returns the address to the WETH smart contract
```solidity
function WETH() public view returns (address)
```

### addLiquidity
Adds Liquidity to an `ERC20 - ERC20` pool.

Always remember to: 
- Give the router an allowance for any of the tokens on the amount desired.
- Add the assets in a ratio based on the price when transaction happened.

A pool is created automatically with the desired amount of tokens if it does not exist. 
```Solidity
function addLiquidity(
    address tokenA, 
    address tokenB, 
    uint256 amountADesired,
    uint256 amountBDesired,
    uint256 amountAMin,
    uint256 amountBMin, 
    address to, 
    uint256 deadline 
) external returns(
    uint256 amountA, 
    uint256 amountB,  
    uint256 liquidity 
) 
```

### addLiquidityETH
Adds liquidity to an `ERC20 - WETH` pool with ETH
Always remember to: 
- Give the router an allowance for the token on the amount desired.
- Add the assets in a ratio based on the price when transaction happened.
- The amount of ETH desired will be gotten from the `msg.value` property.
- Any leftover ETH will be returned to the `msg.sender`.

A pool is created automatically with the desired amount of tokens if it does not exist.
```solidity
function addliquidityETH(
    address token,
    uint256 amountTokenDesired,
    uint256 amountTokenMin,
    uint256 amountETHMin,
    address to,
    uint256 dealine
) external payable returns (
    uint256 amountToken,
    uint256 amountETH,
    uin6256 liquidity
)
```

#### addLiquidity Parameters Glossary

| Name | Data Type | Description |
|------|-----------|-------------|
| amountADesired | uint256 | Amount of tokenA to add as liquidity if the price of B divided by the price of A is less than or equal to amountBDesired divided by amountADesired (A reduces) |
| amountAMin | uint256 | Marks the point at which the B/A price can go up before a transaction reverts. amountAMin must be less than or equalTo amountADesired |
| amountBDesired | uint256 | Amount of tokenB to add as liquidity if the price of A divided by the price of B is less than or equal to amountADesired divided by amountBDesired (B reduces) |
| amountBMin | uint256 | Marks the point at which the A/B price can go up before a transaction reverts. amountBMin must be less than or equalTo amountBDesired |
| amountETHDesired (msg.value) | uint256 | Amount of ETH to add as liquidity if the price of the token divided by the price of WETH is less than or equal to amountTokenDesired divided by amountETHDesired (msg.value) (WETH reduces) |
| amountETHMin | uint256 | Marks the point at which the token/WETH price can go up before the transaction reverts. amountETHMin must be less than or equalTo amountETHDesired (msg.value) |
| amountTokenDesired | uint256 | Amount of token to add as liquidity if the price of WETH divided by the price of the token is less than or equal to amountETHDesired (msg.value) divided by amountTokenDesired (Token reduces) |
| amountTokenMin | uint256 | Marks the point at which the WETH/token price can go up before a transaction reverts. amountTokenMin must be less than or equalTo amountTokenDesired |
| deadline | uint256 | Unix timestamp after which transaction will revert |
| to | address | Address the liquidity token is sent to |
| token | address | Address of token to be added to a pool |
| tokenA | address | Address of token A to be added to a pool |
| tokenB | address | Address of token B to be added to a pool |

#### addLiquidity Function Return Glossary

| Name | Data Type | Description |
|------|-----------|-------------|
| amountA | uint256 | Amount of tokenA sent to the liquidity pool |
| amountB | uint256 | Amount of tokenB sent to the liquidity pool |
| amountETH | uint256 | Amount of ETH converted to WETH and sent to the liquidity pool |
| amountToken | uint256 | Amount of token sent to the liquidity pool |
| liquidity | uint256 | Amount of liquidity tokens minted |

### removeLiquidity
Removes liquidity from an `ERC20 - ERC20` pool.
Always remember to: 
- Give the router an allowance for the token on the amount of liquidity desired.

```solidity
function removeLiquidity(
    address tokenA,
    address tokenB,
    uint256 liquidity,
    uint256 amountAMin,
    uint256 amountBMin,
    address to,
    uint256 deadline
) public returns(uint256 amountA, uint256 amountB)
```

### removeLiquidityETH
Removes liquidity from an `ERC20 - WETH` pool and get back ETH.
Always remember to: 
- Give the router an allowance for the token on the amount of liquidity desired.

```solidity
function removeLiquidityETH(
    address token,
    uint256 iliquidity,
    uint256 amountTokenMin,
    uint256 amountETHMin,
    address to,
    uint256 deadline
) public returns (uint256 amountToken, uint256 amountETH)
```

### removeLiquidityWithPermit
Removes liquidity from an `ERC20 - ERC20` pool without needing approval first. 
```solidity
function removeLiquidityWithPermit(
    address tokenA,
    address tokenB,
    uint256 liquidity,
    uint256 amountAMin,
    uint256 amountBMin,
    address to,
    uint256 deadline,
    bool approveMax,
    uint8 v,
    bytes32 r,
    bytes32 s
) external returns (uint256 amountA, uint256 amountB)
```

### removeLiquidityETHWithPermit
Removes liquidity from an `ERC-20 - WETH` pool and receive ETH without needing approval first.
```solidity
function removeLiquidityETHWithPermit(
    address token,
    uint256 liquidity,
    uint256 amountTokenMin,
    uint256 amountETHMin,
    address to,
    uint256 deadline,
    bool approveMax,
    uint8 v,
    bytes32 r,
    bytes32 s
) external returns (uint256 amountToken, uint256 amountETH)
```

### removeLiquidityETHSupportingFeeOnTransferTokens
Removes liquidity from an `ERC20 - WETH` pool and get back ETH.
Always remember: 
- Give the router an allowance for the token on the amount of liquidity desired.
- This method is necessary for tokens that need a fee on transfer.

```solidity
function removeLiquidityETHSupportingFeeOnTransferTokens(
    address token,
    uint256 liquidity,
    uint256 amountTokenMin,
    uint256 amountETHMin,
    address to,
    uint256 deadline
) public returns (uint256 amountETH)
```

### removeLiquidityETHWithPermitSupportingFeeOnTransferTokens
Removes liquidity from an `ERC20 - WETH` pool and get back ETH without needing approval first.
Always remember: 
- This method is necessary for tokens that need a fee on transfer.

```solidity
function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
    address token,
    uint256 liquidity,
    uint256 amountTokenMin,
    uint256 amountETHMin,
    address to,
    uint256 deadline,
    bool approveMax,
    uint8 v,
    bytes32 r,
    bytes32 s
) external returns (uint256 amountETH)
```

#### remove liquidity functions parameters
| Name | Data Type | Description |
|------|-----------|-------------|
| amountAMin | uint256 | Minimum amount of tokenA that must be received for the transaction not to revert |
| amountBMin | uint256 | Minimum amount of tokenB that must be received for the transaction not to revert |
| amountETHMin | uint256 | Minimum amount of ETH that must be received for the transaction not to revert |
| amountTokenMin | uint256 | Minimum amount of Token that must be received for the transaction not to revert |
| approveMax | bool | Whether or not the approval amount in the signature is for liquidity or uint(-1). |
| deadline | uint256 | Unix timestamp after which transaction will revert |
| liquidity | uint256 | Amount of liquidity tokens to be removed |
| r | bytes32 | r component of the permit signature |
| s | bytes32 | s component of the permit signature |
| to | address | Receiver of the underlying assets |
| token  | uint256 | Address of token |
| tokenA | uint256 | Address of token A |
| tokenB | uint256 | Address of token B |
| v | uint8 | v component of the permit signature |

#### remove liquidity returns function parameter
| Name | Data Type | Description |
|------|-----------|-------------|
| amountA | uint256 | Amount of tokenA received |
| amountB | uint256 | Amount of tokenB received |
| amountETH | uint256 | Amount of ETH received |
| amountToken | uint256 | Amount of token received |

### swapExactTokensForTokens
Swaps an exact amount of input tokens for as many output tokens as possible, along the route determined by the path. 

Always remember: 
- The first element of path is the input token
- The last element is the output token
- Any intermediate elements represent intermediate pairs to trade through (if, for example, a direct pair does not exist).
- Give the router an allowance of atleast the amount inputted for the token being sent in.

```solidity
function swapExactTokensForTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
)
    external
    returns (uint256[] memory amounts)
```

### swapTokensForExactTokens
Receive a specified amount of tokens for as few input tokens as possible, along the route stated in the path.

Always remember:
- The first element of the path is the input token
- The last element of the path is the output token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.
- Givee the router an allowance of at least of at least the maximum amount of input token that could be spent.

```solidity
function swapTokensForExactTokens(
    uint256 amountOut,
    uint256 amountInMax,
    address[] calldata path,
    address to,
    uint256 deadline
)
    external
    returns (uint256[] memory amounts)
```

### swapExactETHForTokens

Swaps an exact amount ETH for as many output tokens as possible using the route stated in the path.

Always remember:
- The amountIn will be specified by the `msg.value` property.
- The first element of the path is the WETH token
- The last element of the path is the output token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.

```solidity
function swapExactETHForTokens(
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
)
    external
    payable
    returns (uint256[] memory amounts)
```

### swapTokensForExactETH

Takes in a maximum amount of token and swaps it for an exact amount of ETH. If possible using a lesser amount of token than the maximum allowed and the route stated in the path.

Always remember:
- If the `to` address is a smart contract, ensure it can receive ETH.
- Give the router an allowance on the maximum amount of input token.
- The first element of the path is the iput token
- The last element of the path is the WETH token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.

```solidity
function swapTokensForExactETH(
    uint256 amountOut,
    uint256 amountInMax,
    address[] calldata path,
    address to,
    uint256 deadline
)
    external
    returns (uint256[] memory amounts)
```

### swapTokensForExactETH

Takes in a maximum amount of token and swaps it for an exact amount of ETH. If possible using a lesser amount of token than the maximum allowed and the route stated in the path.

Always remember:
- If the `to` address is a smart contract, ensure it can receive ETH.
- Give the router an allowance on the maximum amount of input token.
- The first element of the path is the input token
- The last element of the path is the WETH token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.

### swapExactTokensForETH#

Takes in a certain amount of tokens and tries to change it for as much ETH as possible, using the path stated.

Always remember:
- If the `to` address is a smart contract, ensure it can receive ETH.
- Give the router an allowance on the input token.
- The first element of the path is the input token
- The last element of the path is the WETH token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.

```solidity
function swapExactTokensForETH(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
)
    external
    returns (uint256[] memory amounts)
```

### swapETHForExactTokens
Takes in ETH and tries to change as little of it as possible for a certain amount of token using the route specified.

Always remember:
- if any leftover ETH, it wil be returned to `msg.sender`.
- The first element of the path is the WETH token
- The last element of the path is the output token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.
- amountInMax is determined by the `msg.value` property.

```solidity
function swapETHForExactTokens(
    uint256 amountOut,
    address[] calldata path,
    address to,
    uint256 deadline
)
    external
    payable
    returns (uint256[] memory amounts)
```
### swapExactTokensForTokensSupportingFeeOnTransferTokens#

Takes in an exact amount of input token and tries to change it for as much output token as possible, when the tokens need a fee on transfer.

Always remember: 
- The first element of path is the input token
- The last element is the output token
- Any intermediate elements represent intermediate pairs to trade through (if, for example, a direct pair does not exist).
- Give the router an allowance of atleast the amount inputted for the token being sent in.

```solidity
function swapExactTokensForTokensSupportingFeeOnTransferTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
) external 
```

### swapExactETHForTokensSupportingFeeOnTransferTokens
Takes in an exact number of ETH and tries to swap it for as much of the output token as possible. It uses the route stated in the path and is necessary for tokens that require a fee on transfer.

Always remember:
- The amountIn must be specified by the `msg.value` property.
- The first element of the path is the WETH token
- The last element of the path is the output token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.

```solidity
function swapExactETHForTokensSupportingFeeOnTransferTokens(
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
) external payable
```

### swapExactTokensForETHSupportingFeeOnTransferTokens
Takes in an exact number of input tokens and try to change it for as much ETH as possible using the specified route. It is necessary for tokens that require a fee for transfer.

Always remember:
- If the `to` address is a smart contract, ensure it can receive ETH.
- Give the router an allowance on the input token.
- The first element of the path is the input token
- The last element of the path is the WETH token
- Other addresses found in the path will be treated as intermediate pairs used if a direct pair does not exist.

```solidity
function swapExactTokensForETHSupportingFeeOnTransferTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
) external
```

#### swap functions parameters
| Name | Type | Description |
|------|------|-------------|
| amountIn | uint256 | Amount of input tokens or ETH to send |
| amountInMax | uint256 | Maximum amount of input tokens or ETH that might be required before transaction reverts |
| amountOut | uint256 | Amount of output tokens to receive |
| amountOutMin | uint256 | Minimum amount of output tokens to be received to avoid the transaction reverting |
| deadline | uint256 | Unix timestamp after which the transaction reverts |
| path | address[] calldata | Array of token addresses whose length must be greater than two |
| to | address | Receiver of the output tokens |

#### swap functions return parameters
| Name | Type | Description |
|------|------|-------------|
| amounts | uint256[] memory | Array containing the input token amount and other subsequent output tokens |

### quote

Given the amount and reserve for an input token and the reserve for the output token. It makes a call to the quote function of the HodlLibrary and calculates and returns the amount for the other asset representing equivqlent value.

```solidity
function quote(
    uint256 amountA,
    uint256 reserveA,
    uint256 reserveB
) public pure returns (uint256 amountB)
``` 

### getAmountOut

Given the amount and reserve for an input token and the reserve for the output token. It makes a call to the getAmountOut function of the HodlLibrary and returns the maximum amount for an output token while calculating for fees.

```solidity
function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut
) public view returns (uint256 amountOut)
```

### getAmountIn

Given the amount and reserve for an output token and the reserve for the input token. It makes a call to the getAmountIn function of the HodlLibrary and returns the least input token amount while calculating for fees.

```solidity
function getAmountIn(
    uint256 amountOut,
    uint256 reserveIn,
    uint256 reserveOut
) public view returns (uint256 amountIn)
```

### getAmountsOut

Accepts as input an amount and an array of token addresses. Makes a call to the getAmountsOut of the HodlLibrary and for each pair of token address fetches the reserve and calculates the maximum amount for each output token.

```solidity
function getAmountsOut(uint256 amountIn, address[] memory path)
    public
    view
    returns (uint256[] memory amounts)
```

### getAmountsIn

Accepts as input an amount and an array of token addresses. Makes a call to the getAmountsIn of the HodlLibrary and for each pair of token address fetches the reserve and calculates the minimum amount for each input token.

```solidity
function getAmountsIn(uint256 amountOut, address[] memory path)
    public
    view
    returns (uint256[] memory amounts)
```