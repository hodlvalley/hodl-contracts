```solidity
interface IMoneyToken {
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    event Burn(address indexed from, uint256 amount);

    event Transfer(address indexed from, address indexed to, uint256 amount);

    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function delegate(address delegatee) public;

    function delegateBySig(
        address delegatee,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public;

    function getCurrentVotes(address account) external view returns (uint96)

    function getPriorVotes(address account, uint256 blockNumber)
    public
    view
    returns (uint96)
}
```