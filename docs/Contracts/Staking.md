# Staking

The staking contract allows Money token holders to leave their tokens and get rewards in Money token.

## Code
The code to the Staking.sol file can be found here.
N.B To be updated when I confirm the link to the final repo.

## Functions
### enter
Collects the money token to be staked and gives the owner xMoney tokens.
```solidity
function enter(uint256 _amount) public
```

| name | data type | description |
|------|-----------|-------------|
| _amount | uint256 | The amount of money token to stake |

### leave
Collect the xMoney tokens and give the user sum sum of their money token and generated rewards.
```solidity
function leave(uint256 _share) public;
```

| name | data type | description |
|------|-----------|-------------|
| _share | uint256 | The amount of xMoney token to exit from the staking contract |