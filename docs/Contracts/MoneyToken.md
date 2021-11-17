# MoneyToken

This document covers the ERC20 and voting functionality for the pool token.

## Code
The code to the MoneyToken.sol file can be found here.
N.B To be updated when I confirm the link to the final repo.

## Events

### DelegateChanged
This events is emitted when an address chooses who to vote on its behalf. 
```solidity
event DelegateChanged(
    address indexed delegator,
    address indexed fromDelegate,
    address indexed toDelegate
);
```

### DelegateVotesChanged
This event that is emitted when one that is chosen to vote in place of another has balance change.
```solidity
event DelegateVotesChanged(
    address indexed delegate,
    uint256 previousBalance,
    uint256 newBalance
);
```
### Transfer
This event emits when tokens exchanges owner.
```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```
### Burn
This event is emitted when a token is destroyed.
```solidity
event Burn(address indexed from, uint256 amount);
```
### Approval
This event is emitted when you agree that another address is allowed to receive a particular sum of token from you.
```solidiity
event Approval(
    address indexed owner,
    address indexed spender,
    uint256 amount
);
``` 

## Functions

### name
Returns the name of the token
```solidity
function name() external pure returns (string memory);
```

### symbol
Returns the symbol of the token
```solidity
function symbol() external pure returns (string memory)
```

### decimals
Returns the numbers of decimals the token has
```solidity
function decimals() external pure returns (uint8);
```

### totalSupply
Returns the total supply of token available
```solidity
function totalSupply() external view returns (uint256);
```

### allowance
This function allows one to know how much an account is allowed to spend from another's account.
```solidity
function allowance(address account, address spender)
    external
    view
    returns (uint256);
```

#### allowance function parameters
| name | data type | description |
|------|-----------|-------------|
| account | address | The address of the account owner |
| spender | address | The address that is authorized to spend |

#### allowance function return parameters
| name | data type | description |
|------|-----------|-------------|
| | uint256 | The amount the spender is allowed to spend |

### approve
This function allows us to prove that we have agreed that we want to send a maximum amount of our tokens to another account.
```solidity
function approve(address spender, uint256 rawAmount)
    external
    returns (bool)
```

#### approve function parameters
| name | data type | description |
|------|-----------|-------------|
| spender | address | The address we are approving |
| rawAmount | uint256 | The maximum amount we intend to approve |

### balanceOf
This function allows us to know how much an account has.
```solidity
function balanceOf(address account) external view returns (uint256)
```

#### balanceOf function parameters
| name | data type | description |
|------|-----------|-------------|
| account | address | The address whose we are checking for its balance |

#### balanceOf function return parameters
| name | data type | description |
|------|-----------|-------------|
| | uint256 | The amount the account owns |

### transfer
This function allows us to send a certain amount of our tokens to a certain address.
```solidity
function transfer(address dst, uint256 rawAmount) external returns (bool)
```

#### transfer function parameters 
| name | data type | description |
|------|-----------|-------------|
| dst | address | The address we are transfering to |
| rawAmount | uint256 | The amount we are transfering |

#### allowance function return parameters
| name | data type | description |
|------|-----------|-------------|
| | bool | Returns true or false depending on the outcome of the transaction |

### transferFrom
This function allows one to transfer a maximum of the amount a particular address allows it to transfer to another account.
```solidity
function transferFrom(
    address src,
    address dst,
    uint256 rawAmount
) external returns (bool)
```

#### transferFrom function parameters 
| name | data type | description |
|------|-----------|-------------|
| src | address | The address we are transfering from |
| dst | address | The address we are transfering to |
| rawAmount | uint256 | The amount we are transfering |

#### transferFrom function return parameters
| name | data type | description |
|------|-----------|-------------|
| | bool | Returns true or false depending on the outcome of the transaction |

### delegate
This function is used to ensure that votes are delegated.
```solidity
function delegate(address delegatee) public
```

#### delegate function parameters 
| name | data type | description |
|------|-----------|-------------|
| delegatee | address | The address we choose to delegate |

### delegateBySig
This function allows to choose a delegate by passing a signature.
```solidity
function delegateBySig(
    address delegatee,
    uint256 nonce,
    uint256 expiry,
    uint8 v,
    bytes32 r,
    bytes32 s
) public
```

#### delegate function parameters 
| name | data type | description |
|------|-----------|-------------|
| delegatee | address | The address we choose to delegate |
| nonce | uint256 | Atransaction counter in each account that prevents replay attacks |
| expiry | uint256 | The time needed before the transaction expires | 
| v | uint8 | v component of the permit signature |
| r | bytes32 | r component of the permit signature |
| s | bytes32 | s component of the permit signature |

### getCurrentVotes
Returns the number of votes an account has.
```solidity
function getCurrentVotes(address account) external view returns (uint96)
```

#### getCurrentVotes function parameters 
| name | data type | description |
|------|-----------|-------------|
| account | address | The address we are getting a current vote for. |

#### getCurrentVotes function return parameters
| name | data type | description |
|------|-----------|-------------|
| | uint96 | Returns the number of votes. |

### getPriorVotes
Returns the number of votes for an account as of a block number
```solidity
function getPriorVotes(address account, uint256 blockNumber)
    public
    view
    returns (uint96)
```
#### getpriorVotes function parameters 
| name | data type | description |
|------|-----------|-------------|
| account | address | The address we are getting a prior vote for. |
| blockNumber | uint256 | The number of the block we are querying about an account prior votes. |

#### getCurrentVotes function return parameters
| name | data type | description |
|------|-----------|-------------|
| | uint96 | Returns the number of votes. |