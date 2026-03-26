// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * @title BountyEscrow
 * @notice Escrow contract for issue-based bounties.
 * Flow:
 * 1) Creator locks ERC20 funds with createBounty.
 * 2) Solver submits PR URL with submitSolution.
 * 3) Owner/relayer resolves with resolveBounty (approve/reject).
 * 4) Funds go to solver (approve) or creator (reject).
 */
contract BountyEscrow {
    enum Status {
        Open,
        Submitted,
        Resolved
    }

    struct Bounty {
        uint256 id;
        address creator;
        string issueUrl;
        uint256 amount;
        Status status;
        address solver;
        string prUrl;
        bool approved;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    IERC20 public immutable token;
    address public owner;
    uint256 public nextBountyId = 1;

    mapping(uint256 => Bounty) public bounties;

    event OwnerUpdated(address indexed previousOwner, address indexed newOwner);
    event BountyCreated(
        uint256 indexed bountyId,
        address indexed creator,
        uint256 amount,
        string issueUrl
    );
    event SolutionSubmitted(
        uint256 indexed bountyId,
        address indexed solver,
        string prUrl
    );
    event BountyResolved(
        uint256 indexed bountyId,
        bool approved,
        address indexed payoutTo,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address tokenAddress, address initialOwner) {
        require(tokenAddress != address(0), "token=0");
        require(initialOwner != address(0), "owner=0");
        token = IERC20(tokenAddress);
        owner = initialOwner;
    }

    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "owner=0");
        emit OwnerUpdated(owner, newOwner);
        owner = newOwner;
    }

    function createBounty(string calldata issueUrl, uint256 amount) external returns (uint256 bountyId) {
        require(bytes(issueUrl).length > 0, "issueUrl");
        require(amount > 0, "amount");

        bountyId = nextBountyId++;

        bool pulled = token.transferFrom(msg.sender, address(this), amount);
        require(pulled, "transferFrom failed");

        bounties[bountyId] = Bounty({
            id: bountyId,
            creator: msg.sender,
            issueUrl: issueUrl,
            amount: amount,
            status: Status.Open,
            solver: address(0),
            prUrl: "",
            approved: false,
            createdAt: block.timestamp,
            resolvedAt: 0
        });

        emit BountyCreated(bountyId, msg.sender, amount, issueUrl);
    }

    function submitSolution(uint256 bountyId, string calldata prUrl) external {
        Bounty storage b = bounties[bountyId];
        require(b.id != 0, "bounty not found");
        require(b.status == Status.Open, "not open");
        require(bytes(prUrl).length > 0, "prUrl");

        b.status = Status.Submitted;
        b.solver = msg.sender;
        b.prUrl = prUrl;

        emit SolutionSubmitted(bountyId, msg.sender, prUrl);
    }

    function resolveBounty(uint256 bountyId, bool approved) external onlyOwner {
        Bounty storage b = bounties[bountyId];
        require(b.id != 0, "bounty not found");
        require(b.status == Status.Submitted, "not submitted");

        b.status = Status.Resolved;
        b.approved = approved;
        b.resolvedAt = block.timestamp;

        address payoutTo = approved ? b.solver : b.creator;
        require(payoutTo != address(0), "payout=0");

        bool sent = token.transfer(payoutTo, b.amount);
        require(sent, "transfer failed");

        emit BountyResolved(bountyId, approved, payoutTo, b.amount);
    }

    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }
}

