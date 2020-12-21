App = {
  loading: false,
  contracts: {},
  auction:{},

  load: async () => {
    
    await App.loadWeb3()
    await App.loadAccount()
    
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
      }
    }
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      web3.eth.sendTransaction({/* ... */})
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = await web3.eth.getAccounts(function(error, accounts) {
      App.account = accounts[0];
    });
  },

  loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const auction = await $.getJSON('Auction.json')
      App.contracts.Auction = TruffleContract(auction)
      App.contracts.Auction.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.auction = await App.contracts.Auction.deployed()
  },


  render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
      App.currentInvestment = (await App.auction.getCurrentInvestment()).c[0];
      var auctionInfo = await App.auction.getInfo()
      App.auctionInfo = auctionInfo;
      // Update app loading state
      App.setLoading(true)
      // Render Account
      $('#account').html(App.account)
      $('#bidCount').html(auctionInfo[4].c[0])
      $('#startPrice').html(auctionInfo[1].c[0])
      $('#currPrice').html(auctionInfo[0].c[0])
      $('#winning').html(auctionInfo[2])
      $('#investment').html(App.currentInvestment)
      var inputbox = document.getElementById('bid');
      inputbox.addEventListener('input', App.myFunction, false);
      App.clockInit(auctionInfo[5].c[0]);
      console.log(auctionInfo);

      // Render Tasks
      // await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },

    renderButtons(distance, x){

      // Owner
      if(App.account == App.auctionInfo[6] && distance > 0){
        // Close button
        document.getElementById("button2").hidden = false;
        document.getElementById("button2").disabled = false;
      }
      // Customer
      else if(distance > 0){

        //Bid Button
        //document.getElementById("button1").disabled = false;
        document.getElementById("button1").hidden = false;
        // Bid input box
        document.getElementById("bid").disabled = false;
        document.getElementById("bid").hidden = false;
        document.getElementById("bid").min = App.auctionInfo[0].c[0] + 1;
      }
      // If Autction Ended
      if (distance < 0) {
        clearInterval(x);
        if (!App.auctionInfo[3]) document.getElementById("timer").innerHTML = "AUCTION HAS ENDED";
        else document.getElementById("timer").innerHTML = "AUCTION CANCELED";
        document.getElementById("button1").disabled = true;
        document.getElementById("button1").hidden = true;
        document.getElementById("bid").disabled = true;
        document.getElementById("bid").hidden = true;

        if(App.account == App.auctionInfo[6] && distance < 0){
          // Close button
          document.getElementById("button2").hidden = true;
          document.getElementById("button2").disabled = true;
        }

        // 1. Closed && Owner != User
        // 2. Invested && Not Highest Bidder && not canceled
        // 3. Owner == user && not canceled
        if((App.currentInvestment > 0 && App.auctionInfo[3] && App.auctionInfo[6] != App.account) 
        || (App.currentInvestment > 0 && App.account != App.auctionInfo[2] && !App.auctionInfo[3])
        || (App.auctionInfo[6] == App.account && !App.auctionInfo[3] && !App.auctionInfo[7])){
          document.getElementById("button3").hidden = false;
          document.getElementById("button3").disabled = false;
        }

      

        if(!App.auctionInfo[3]){
          if(App.account == App.auctionInfo[2] && App.currentInvestment > 0){
            document.getElementById("timerText").innerHTML = "YOU HAVE WON!";
            document.getElementById("timerText").style.color = "green";
          }else if(App.currentInvestment > 0){
            document.getElementById("timerText").innerHTML = "YOU HAVE LOST! :(";
            document.getElementById("timerText").style.color = "red";
        }
      }
      }
    },

    myFunction: async () => {
      if($('#bid').val() >= App.auctionInfo[0].c[0] + 1 && $('#bid').val() >= App.auctionInfo[1].c[0] + 1){
        document.getElementById("button1").disabled = false;
        console.log($('#bid').val())
      }else{
        document.getElementById("button1").disabled = true;
        console.log($('#bid').val())
     }
    },

    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    },

    withdraw : async () => {
      await App.auction.withdraw();
    },
    placeBid: async () => {
      console.log("Click!");
      var bidSum = $('#bid').val()
      // App.setLoading(true)

      // web3.eth.sendTransaction({
      // to:'0xf17f52151EbEF6C7334FAD080c5704D77216b732', 
      // from: App.account, 
      // value:web3.toWei(bidSum, "ether")
      // }, console.log)

      await App.auction.placeBid(parseInt(bidSum));
      window.location.reload()
    },
    
    getEnd: async () => {
      return await App.auction.getEnd();
    },

    closeAuction: async () =>{
      await App.auction.CloseAuction();
      window.location.reload()
    },

    clockInit(auctionEnd){
      var countDownDate = new Date(auctionEnd * 1000);
      console.log(countDownDate)
      //var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();
      
      // Update the count down every 1 second
      var x = setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();
      
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
      
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
        // Display the result in the element with id="demo"
        document.getElementById("timer").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";
        App.renderButtons(distance, x);
        // If the count down is finished, write some text
      }, 1000);
    }

}

$(() => {
  $(window).load(() => {
    App.load()
  })
})