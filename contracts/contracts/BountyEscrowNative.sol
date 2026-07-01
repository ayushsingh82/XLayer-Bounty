// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BountyEscrowNative
 * @notice Escrow bounties in native OKB (msg.value).
 * Flow:
 * 1) Creator creates bounty with issue URL and sends native OKB.
 * 2) Solver submits PR URL.
 * 3) Owner/relayer resolves approved/rejected.
 * 4) Payout goes to solver on approval, creator on rejection.
 */
contract BountyEscrowNative {
    enum Status {
        Open,
        Submitted,
        Resolved
    }

    struct Bounty {
        uint256 id;
        address creator;
        string issueUrl;
        uint256 amountWei;
        Status status;
        address solver;
        string prUrl;
        bool approved;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    address public owner;
    uint256 public nextBountyId = 1;
    mapping(uint256 => Bounty) public bounties;

    event OwnerUpdated(address indexed previousOwner, address indexed newOwner);
    event BountyCreated(
        uint256 indexed bountyId,
        address indexed creator,
        uint256 amountWei,
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
        uint256 amountWei
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address initialOwner) {
        require(initialOwner != address(0), "owner=0");
        owner = initialOwner;
    }

    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "owner=0");
        emit OwnerUpdated(owner, newOwner);
        owner = newOwner;
    }

    function createBounty(string calldata issueUrl) external payable returns (uint256 bountyId) {
        require(bytes(issueUrl).length > 0, "issueUrl");
        require(msg.value > 0, "amount=0");

        bountyId = nextBountyId++;
        bounties[bountyId] = Bounty({
            id: bountyId,
            creator: msg.sender,
            issueUrl: issueUrl,
            amountWei: msg.value,
            status: Status.Open,
            solver: address(0),
            prUrl: "",
            approved: false,
            createdAt: block.timestamp,
            resolvedAt: 0
        });

        emit BountyCreated(bountyId, msg.sender, msg.value, issueUrl);
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

        address payable payoutTo = payable(approved ? b.solver : b.creator);
        require(payoutTo != address(0), "payout=0");

        uint256 amount = b.amountWei;
        b.amountWei = 0;
        (bool sent, ) = payoutTo.call{value: amount}("");
        require(sent, "native transfer failed");

        emit BountyResolved(bountyId, approved, payoutTo, amount);
    }

    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }
}

