# Farming

The farming contract allows any HVLP tokens holder to stakes their tokens and get rewards in Money token.

## Code
The code to the Farming.sol file can be found here.
N.B To be updated when I confirm the link to the final repo.

## Events
### Deposit
The deposit event is emitted when a HVLP tokens holder sends in their tokens so as to get rewards in Money token.
```solidity
event Deposit(
    address indexed user, 
    uint256 indexed pid, 
    uint256 amount
);
```

### Withdraw
The Withdraw event is triggered when a user decides to return the Money token in his possesion and collect by the HVLP token he deposited as well as the accrued rewards.
```solidity
event Withdraw(
    address indexed user, 
    uint256 indexed pid, 
    uint256 amount
);
```

### Emergency
THe EmergencyWithdraw event is emitted when a user returns the Money token in their possesion for the HVLP token they submoitted, before the end of a farming cycle.
```solidity
event EmergencyWithdraw(
    address indexed user,
    uint256 indexed pid,
    uint256 amount
);
```

## Functions
### money
Returns the address of the money smart contract
```solidity
function money() public view returns (address)
```
#### money function return parameters
| name | data type | description |
|------|-----------|-------------|
|  | address | The address of the money smart contract |

### reserve
Returns the address of the reserve smart contract.
```solidity
function reserve() public view returns (address)
```
#### reserve function return parameters
| name | data type | description |
|------|-----------|-------------|
|  | address | The address of the reserve smart contract |

### feeAddress
Returns the address where liquidity pool tokens will be deposited to.
```solidity
function feeAddress() public view returns (address);
```
#### feeAddress function return parameters
| name | data type | description |
|------|-----------|-------------|
|  | address | The address of the feeAddress smart contract |

### poolLength
This returns number of pools avilable
```solidity
function poolLength() external view returns (uint256);
```

### deposit
Accepts HVLP tokens submitted into a specified pool.
```solidity
function deposit(uint256 _pid, uint256 _amount) public;
```

#### deposit function parameters
| name | data type | description |
|------|-----------|-------------|
| _pid | uint256 | The id of the pool we are submitting the HVLP tokens to |
| _amount | uint256 | The amount of HVLP we are submitting to the pool |

### withdraw
Returns a specified amount of HVLP tokens plus the rewards it has gained a from a pool.
```solidity
function withdraw(uint256 _pid, uint256 _amount) public;
```

#### withdraw function parameters
| name | data type | description |
|------|-----------|-------------|
| _pid | uint256 | The id of the pool we are withdrawing the HVLP tokens from |
| _amount | uint256 | The amount of HVLP we are withdrawing from the pool |

### massUpdatePools
Updates reward variables for all pools.
```solidity
function massUpdatePools() public;
```

### updatePool
Update the reward variables for a specified pool.
```solidity
function updatePool(uint256 _pid) public;
```

#### update function parameters
| name | data type | description |
|------|-----------|-------------|
| _pid | uint256 | The id of the pool we are updating its reward variables. |
