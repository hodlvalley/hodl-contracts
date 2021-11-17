```solidity
interface Ifarming{
    event Deposit(
        address indexed user, 
        uint256 indexed pid, 
        uint256 amount
    );

    event Withdraw(
        address indexed user, 
        uint256 indexed pid, 
        uint256 amount
    );

    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    function money() public view returns (address);

    function reserve() public view returns (address);

    function feeAddress() public view returns (address);

    function poolLength() external view returns (uint256);

    function deposit(uint256 _pid, uint256 _amount) public;

    function withdraw(uint256 _pid, uint256 _amount) public;

    function massUpdatePools() public;

    function updatePool(uint256 _pid) public;
}
```