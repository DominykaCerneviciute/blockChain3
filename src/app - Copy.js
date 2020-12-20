App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      
      await App.loadWeb3()
      console.log('hello!')
      await App.loadAccount()
      
      await App.loadContract()
      await App.render()
    },
  
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
        console.log(web3);
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        console.log("2?");
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          console.log(window.web3);
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        console.log("1?");
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
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
    
        // Update app loading state
        App.setLoading(true)
    
        // Render Account
        $('#account').html(App.account)
    
        // Render Tasks
        await App.renderTasks()
    
        // Update loading state
        App.setLoading(false)
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


      placeBid: async () => {
        App.setLoading(true)
        await App.account.placeBid.call()
        window.location.reload()
      },

      


}
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })