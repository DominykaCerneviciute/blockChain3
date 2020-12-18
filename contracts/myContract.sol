pragma solidity >=0.5.0 <0.7.0;

contract Auction {
address internal owner; 
uint public auction_start;
uint public auction_end;
uint public highestBid;
address public highestBidder;
bool public canceled;
bool internal ownerHasWithdrawn = false;

mapping(address => uint256) public bidder;

struct car {
string     Brand; 
string     Rnumber;
}

car public Mycar;

constructor(address _owner, uint _end, uint _highestBid) public{
    
    owner = _owner;
    auction_start = now;
    auction_end = auction_start +  _end* 1 hours; 
    highestBid = _highestBid;
    canceled = false;
    
}


modifier an_ongoing_auction() {require(now < auction_end);
    _;
}

modifier only_owner() {require(msg.sender == owner);
    _;
}

modifier not_owner() {require(msg.sender != owner);
    _;
}

modifier not_canceled(){require(canceled == false);
    _;
}
modifier endOrCanceled(){require(now >= auction_end || canceled == true);
    _;
}

function placeBid() public payable 
an_ongoing_auction
not_owner
not_canceled
{
    
    require(bidder[msg.sender] + msg.value > highestBid);
    uint newBid = bidder[msg.sender] + msg.value; 
    highestBid = newBid;
    bidder[msg.sender] = newBid;
    highestBidder = msg.sender;
    
    emit BidEvent(highestBidder, highestBid);
}


function getHighestBid() public view returns (uint){
    return highestBid;
}

function getHighestBidder() public view returns (address){
    return highestBidder;
}


function withdraw() public payable
endOrCanceled
returns (bool)
{
    uint amount;
    address account;
    
    if(canceled == true && msg.sender != owner){
        amount = bidder[msg.sender];
        account = msg.sender;
    }
    
    else{
        if(msg.sender == owner){
            amount = highestBid;
            account = highestBidder;
            ownerHasWithdrawn = true;
        }
        
        else if(msg.sender != highestBidder){
            amount = bidder[msg.sender];
            account = msg.sender;
        }
    }
    
    require(amount >0);
    msg.sender.transfer(amount);
    bidder[msg.sender] = 0;
    WithdrawalEvent(account, amount);
    return true;
}


function cancelAuction() external
only_owner
an_ongoing_auction
not_canceled
returns (bool) {
    
    canceled = true;
    emit CanceledEvent("CANCELED");
    return true;
}


function timeLeft() public view returns (uint){
    uint time;
    if(now>= auction_end) return 0;
    else {
        time = auction_end - now;
        return time;
    }
}

event BidEvent(address indexed highestBidder, uint highestBid);
event WithdrawalEvent(address withdrawer, uint amount);
event CanceledEvent(string message);

}
