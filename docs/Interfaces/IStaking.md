```solidity
IStaking {
    // Enter the bar. Pay some MONEYs. Earn some shares.
    // Locks Money and mints xMoney
    function enter(uint256 _amount) public;

    // Leave the bar. Claim back your MONEYs.
    // Unlocks the staked + gained Money and burns xMoney
    function leave(uint256 _share) public;
}
```