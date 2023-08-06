pragma solidity ^0.8.0;


contract ERC20Interface {
    function totalSupply() public view returns (uint256);
    function balanceOf(address tokenOwner) public view returns (uint256 balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint256 amount) public returns (bool success);
    function approve(address spender, uint256 amount) public returns (bool success);
    function transferFrom(address from, address to, uint256 tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed tokenOwner, address indexed spender, uint256 amount);
}


contract ERC20 is ERC20Interface {
    string public name;
    string public symbol;
    uint8 public decimals; 
    uint256 public totalSupply;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;


    constructor(string _name, string _sym, uint256 _decimals, uint256 _totalSupply) public {
        name = _name;
        symbol = _sym;
        decimals = _decimals;
        totalSupply = _supply;

        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address who) public view returns (uint256 balance) {
        return balances[who];
    }

    function allowance(address tokenOwner, address spender) public view returns (uint256 remaining) {
        return allowed[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool success) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public returns (bool success) {
        require(balances[msg.sender] - amount >= 0, 'Insufficient balance')
        balances[msg.sender] = balances[msg.sender] - amount;
        balances[to] = balances[to] + amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool success) {
        require(balances[from] - amount >= 0, 'Insufficient balance')

        balances[from] = balances[from] - amount;

        require(allowed[from][msg.sender] - amount > 0, 'Insufficient allowance')

        allowed[from][msg.sender] = allowed[from][msg.sender] - amount;
        balances[to] = balances[to] + amount;
        emit Transfer(from, to, amount);
        return true;
    }
    function mint(address account, uint256 amount) public returns (bool success) {
        require(account != address(0), "Invalid address");
        
        totalSupply += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
        return true;
    }
}