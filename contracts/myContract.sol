pragma solidity >=0.5.0 <0.7.0;

contract Auction {
address internal owner; 
uint public auction_start;
uint public auction_end;
uint public highestBid;
address public highestBidder;
bool public canceled;
bool internal ownerHasWithdrawn = false;
uint public startingPrice;
uint public totalBidders;
mapping(address => uint256) public bidder;

constructor(uint _end, uint _highestBid) public{
    
    owner = msg.sender;
    auction_start = now;
    auction_end = auction_start +  _end* 1 minutes; 
    startingPrice = _highestBid;
    canceled = false;
    totalBidders= 0;
    
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

function getInfo() view public returns(uint _highestBid, uint _startingPrice, address _highestBidder , bool _canceled , uint _totalBidders, uint _auction_end, address _owner){

return(highestBid, startingPrice, highestBidder, canceled, totalBidders, auction_end, owner);
}

function placeBid(uint sum) public payable 
an_ongoing_auction
not_owner
not_canceled
{
    
    require(sum > highestBid);
    uint newBid = sum; 
    highestBid = newBid;
    if(bidder[msg.sender] == 0){
        totalBidders++;
    }
    bidder[msg.sender] = newBid;
    highestBidder = msg.sender;

    
    
    emit BidEvent(highestBidder, totalBidders, highestBid);
}

function getCurrentInvestment() view public  returns (uint _bid){
    return bidder[msg.sender];
}

function getHighestBid() view public  returns (uint){
    return highestBid;
}

function getHighestBidder() view public  returns (address){

    return highestBidder;
}

function getStartingPrice() view public  returns (uint){
    return startingPrice;
}

function getEnd() public view returns (uint){
    return auction_end;
}

function withdraw() public
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
        }
        
        else if(msg.sender != highestBidder){
            amount = bidder[msg.sender];
            account = msg.sender;
        }
    }
    
    require(amount >0);
    // msg.sender.transfer(amount);
    bidder[account] = 0;
    totalBidders--;
    emit WithdrawalEvent(account, amount);
    return true;
}


function CloseAuction() external
only_owner
an_ongoing_auction
not_canceled
returns (bool) {
    highestBidder = address(0);
    highestBid = 0;
    startingPrice = 0;
    auction_end = now;
    canceled = true;
    emit CloseEvent("ForceClose");
    return true;
}


event BidEvent(address indexed buyer, uint totalBidders, uint amount);
event WithdrawalEvent(address withdrawer, uint amount);
event CloseEvent(string message);

}