// ============================================
// ADVANCED BANKING SYSTEM - Pure JavaScript
// Focus: Closures, OOP, Design Patterns
// ============================================

// ============================================
// 1. UTILITY FUNCTIONS WITH CLOSURES
// ============================================

/**
 * ID Generator using Closure
 * Demonstrates: Closure maintaining private state
 */
function createIDGenerator(prefix = 'ACC') {
	let counter = 1000;
	
	return () => {
		counter++;
		return `${prefix}${counter}`
	}
}

const generateAccountNumber = createIDGenerator('ACC');
const generateTransactionID = createIDGenerator('TXN');

/**
 * Date Formatter using Closure
 * Demonstrates: Closure with configuration
 */
function createDateFormater(locale = 'en-US') {
	return (date = new Date()) => {
		return new Intl.DateTimeFormat(locale, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(date);
	};
}

const formatDate = createDateFormater();

/**
 * Currency Formatter using Closure
 * Demonstrates: Closure with preset configuration
 */
function createCurrencyFormatter(currency = 'USD', locale = 'en-US') {
	return (amount) => {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency
		}).format(amount);
	}
}

const formatCurrency = createCurrencyFormatter();

// ============================================
// 2. TRANSACTION FACTORY WITH CLOSURE
// ============================================

/**
 * Transaction Factory
 * Demonstrates: Factory pattern with closures
 */
function createTransaction(type, amount, description = '', relatedAccount = null) {
	const id = generateTransactionID();
	const timestamp = new Date();
	const status = 'completed';
	
	// Private data - only accessible through returned methods
	return {
		getId: () => id,
		getType: () => type,
		getAmount: () => amount,
		getDescription: () => description,
		getTimestamp: () => timestamp,
		getStatus: () => status,
		getRelatedAccount: () => relatedAccount,
		toJSON: function() {
			return {
				id,
				type,
				amount,
				description,
				timestamp: formatDate(timestamp),
				status,
				relatedAccount
			};
		},
	}
}
 
 
 
// ============================================
// 3. ACCOUNT CLASS WITH CLOSURES
// ============================================

/**
 * Bank Account Factory
 * Demonstrates: Data privacy, encapsulation with closures
 */
 function createBankAccount(accountHolder, initialDeposit, accountType = 'savings', pin = '1234') {
	let balance = 0;
	let transactions = [];
	let accountNumber = generateAccountNumber();
	let isActive = true;
	let loans = [];
	let createdAt = new Date();
	
	const interestRates = {
		savings: 0.33,
		checking: 0.01,
		business: 0.02
	}
	
	// private methods
	function addTransactions(transaction) {
		transactions.push(transaction)
	}
	
	function validatePin(inputPin) {
		return inputPin === pin;
	}
	
	function isAccountActive() {
		if(!isActive) {
			console.log('Account is not active!');
			return false;
		}
		
		return true;
	}
	
	// Initialize with initial deposit
	if(initialDeposit >= 100) {
		balance = initialDeposit;
		const transaction = createTransaction('deposit', initialDeposit, 'Initial deposit');
		addTransaction(transaction);
	} else {
		console.log('Initial deposit must be at least $100');
		return null;
	}
	
	// Public API - methods that form closures over private variables
	return {
		// account information
		getAccountNumber: () => accountNumber,
		getAccountHolder: () => accountHolder,
		getAccountType: () => accountType,
		getBalance: (inputPin) => {
			if(!validatePin(inputPin)) {
				console.log('Invalid PIN!');
				return null;
			}
			return balance;
		},
		
		getInterestRate: () => interestRates[accountType],
		
		isActive: () => isActive,
		
		getCreatedDate: () => formatDate(createdAt),
		
		// Deposit money
		deposit: function(amount, description = '', inputPin) {
			if(!validatePin(inputPin)) {
				console.log('Invalid PIN!');
				return false;
			}
			
			if(!isAccountActive()) return false;
			
			if(amount <= 0) {
				console.log('Deposit amount must be positive!');
				return false;
			}
			
			balance += amount;
			const transaction = createTransaction('deposit', amount, description);
			addTransaction(transaction);
			
			console.log(`Deposited ${formatCurrency(amount)}. New balance: ${formatCurrency(balance)}`);
			return true;
		},
		
		withdraw: function(amount, description = '', inputPin) {
			if(!validatePin(inputPin)) {
				console.log('Invalid pin!');
				return false;
			}
			
			if(!isAccountActive) return false;
			
			if(amount > balance) {
				console.log(`Insufficient funds! Available: ${formatCurrency(balance)}`);
				return false;
			}
			
			balance -= amount;
			const transaction = createTransaction('withdrawal', amount, description);
			addTransaction(transaction);
			
			console.log(`Withdrew ${formatCurrency(amount)}. New balance: ${formatCurrency(balance)}`);
			return true;
		},
		
		// Transfer money to another account
		transfer: function(recipientAccount, amount, description = '', inputPin) {
			if(!validatePin(inputPin)) {
				console.log('Invalid Pin');
				return false;
			}
			
			if(!isAccountActive) return false;
			
			if(amount <= 0) {
				console.log(`Transfer amount must be positive!`);
				return false;
			}
			
			if(amount > balance) {
				console.log(`Insufficient funds! Available: ${formatCurrency(balance)}`);
				return false;
			}
			
			// Withdraw from this account
			balance -= amount;
			const outgoingTransaction = createTransaction(
				'transfer-out', 
				amount, 
				description || `Transfer to ${recipientAccount.getAccountNumber()}`,
				recipientAccount.getAccountNumber()
			);
			
			addTransaction(outgoingTransaction);
			
			// Deposit to recipient account (internal transfer, no PIN needed)
			recipientAccount._internalDeposit(amount, `Transfer from ${accountNumber}`);
			
			console.log(`Transferred ${formatCurrency(amount)} to ${recipientAccount.getAccountNumber()}`);
			console.log(`   New Balance: ${formatCurrency(balance)}`);
			
			return true;
		},
		
		// Internal deposit (for transfers) - not exposed in public docs
		_internalDeposit: function(amount, description = '') {
			balance += amount;
			const transaction = createTransaction('transfer-in', amount, description);
			addTransaction(transaction);
		},
		
		// Request Loan
		requestLoan: function(amount, inputPin) {
			if(!validatePin(inputPin)) return false;
			if(!isAccountActive) return false;
			
			// Load eligibility: Must have at least 10% of loan amount as deposit
			const requiredDeposit = amount * 0.1;
			
			// Check if any deposit is at least 10% of load amount
			const hasEligibleDeposit = transaction.some(txn => txn.getType() === 'deposit' && txn.getAmount() >= requiredDeposit)
			
			if(!hasEligibleDeposit) {
				console.log(`Load denied! You need at least one deposit of ${formatCurrency(requiredDeposit)}`);
				return false;
			}
			
			// Maximum load: 2x current balance
			const maxLoad = balance * 2;
			
			if(amount > maxLoad) {
				console.log(`Maximum load amount is ${formatCurrency(maxLoan)} (2x your balance)`)
				return false;
			}
			
			// Approved loan
			balance += amount;
			loans.push({amount, date: new Date()});
			const transaction = createTransaction('loan', amount, 'Load approved');
			addTransaction(transaction);
			
			console.log(`Loan of ${formatCurrency(amount)} approved!`);
			console.log(`New Balance: ${formatCurrency(balance)}`);
			return true;
		},
		applyInterest: function(inputPin) {
			if(!validatePin(inputPin)) return false;
			if(!isAccountActive) return false;
			
			const interestRate = interestRates[accountType];
			const interest = balance * interestRate;
			balance += interest;
			
			const transaction = createTransaction('interest', interest, `Interest applied at ${(interestRate * 100).toFixed(1)}%`);
			addTransaction(transaction);
			
			console.log(`Interest of ${formatCurrency(interest)} applied. New Balance: ${formatCurrency(balance)}`);
			return true;
		},
		
		// Get transaction history
		getTransactionHistory: function(inputPin, filterType = 'all') {
			if(!validatePin(inputPin)) return false;
			if(!isAccountActive) return false;
			
			let filtered = transactions;
			
			if(filterType !== 'all') {
				filtered = transactions.filter(txn => txn.getType() === filterType);
			}
			
			return filtered.map(txn => txn.toJSON());
		},
		
		// Get account summary
		getSummary: function(inputPin) {
			if(!validatePin(inputPin)) return false;
			
			const deposits = transactions
								.filter(t => t.getType() === 'deposits' || t.getType() === 'transfer-in')
								.reduce((sum, t) => sum + t.getAmount(), 0);
			const withdrawals = transactions
								.filter(t => t.getType() === 'withdrawal' || t.getType() === 'transfer-out')
								.reduce((sum, t) => sum + t.getAmount(), 0);
			const totalLoans = loans.reduce((sum, loan) => sum + load.amount, 0);
			
			return {
				accountNumber,
				accountHolder,
				accountType,
				balance,
				interestRate: (interestRates[accountType] * 100).toFixed(1) + '%',
				totalDeposits: deposits,
				totalWithdrawals: withdrawals,
				totalTransactions: transactions.length,
				totalLoans,
				isActive,
				createdAt: formatDate(createdAt)
			}
		},
		// Close account
		closeAccount: function(inputPin) {
		  if (!validatePin(inputPin)) {
			console.log('❌ Invalid PIN!');
			return false;
		  }
		  
		  if (balance > 0) {
			console.log(`❌ Cannot close account with balance of ${formatCurrency(balance)}. Please withdraw all funds first.`);
			return false;
		  }
		  
		  if (loans.length > 0) {
			console.log('❌ Cannot close account with outstanding loans!');
			return false;
		  }
		  
		  isActive = false;
		  console.log('✅ Account closed successfully.');
		  return true;
		},
		
		// Change PIN
		changePin: function(oldPin, newPin) {
		  if (!validatePin(oldPin)) {
			console.log('❌ Invalid current PIN!');
			return false;
		  }
		  
		  if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
			console.log('❌ New PIN must be 4 digits!');
			return false;
		  }
		  
		  pin = newPin;
		  console.log('✅ PIN changed successfully!');
		  return true;
		}
	};
 }


// ============================================
// 4. BANK MANAGEMENT SYSTEM WITH CLOSURE
// ============================================

/**
 * Bank Management System
 * Demonstrates: Module pattern, data encapsulation, closures
 */
function createBankingSystem(bankName = 'Advanced Bank') {
  // Private variables
  let accounts = [];
  const bankID = Math.random().toString(36).substring(7).toUpperCase();
  const createdDate = new Date();
  
  // Private helper functions
  function findAccountByNumber(accountNumber) {
    return accounts.find(acc => acc.getAccountNumber() === accountNumber);
  }
  
  function findAccountByHolder(holderName) {
    return accounts.filter(acc => 
      acc.getAccountHolder().toLowerCase().includes(holderName.toLowerCase())
    );
  }
  
  // Public API
  return {
    getBankName: () => bankName,
    getBankID: () => bankID,
    
    // Create new account
    createAccount: function(accountHolder, initialDeposit, accountType = 'savings', pin = '1234') {
      console.log(`\n🏦 Creating account for ${accountHolder}...`);
      
      const account = createBankAccount(accountHolder, initialDeposit, accountType, pin);
      
      if (account) {
        accounts.push(account);
        console.log(`✅ Account created successfully!`);
        console.log(`   Account Number: ${account.getAccountNumber()}`);
        console.log(`   Type: ${accountType}`);
        console.log(`   Initial Balance: ${formatCurrency(initialDeposit)}`);
        return account;
      }
      
      return null;
    },
    
    // Get account by number
    getAccount: function(accountNumber) {
      const account = findAccountByNumber(accountNumber);
      if (!account) {
        console.log(`❌ Account ${accountNumber} not found!`);
        return null;
      }
      return account;
    },
    
    // Search accounts by holder name
    searchAccounts: function(holderName) {
      const results = findAccountByHolder(holderName);
      
      if (results.length === 0) {
        console.log(`❌ No accounts found for "${holderName}"`);
        return [];
      }
      
      console.log(`\n🔍 Found ${results.length} account(s) for "${holderName}":`);
      results.forEach(acc => {
        console.log(`   - ${acc.getAccountNumber()}: ${acc.getAccountHolder()} (${acc.getAccountType()})`);
      });
      
      return results;
    },
    
    // Get all accounts summary
    getAllAccounts: function() {
      console.log(`\n📊 ${bankName} - Total Accounts: ${accounts.length}`);
      accounts.forEach(acc => {
        console.log(`   ${acc.getAccountNumber()}: ${acc.getAccountHolder()} - ${acc.getAccountType()}`);
      });
      return accounts;
    },
    
    // Get bank statistics
    getBankStatistics: function() {
      const totalAccounts = accounts.length;
      const activeAccounts = accounts.filter(acc => acc.isActive()).length;
      
      const accountTypes = accounts.reduce((acc, account) => {
        const type = account.getAccountType();
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      return {
        bankName,
        bankID,
        totalAccounts,
        activeAccounts,
        inactiveAccounts: totalAccounts - activeAccounts,
        accountTypes,
        createdDate: formatDate(createdDate)
      };
    },
    
    // Transfer between accounts (bank-level)
    transferBetweenAccounts: function(fromAccountNumber, toAccountNumber, amount, pin) {
      const fromAccount = findAccountByNumber(fromAccountNumber);
      const toAccount = findAccountByNumber(toAccountNumber);
      
      if (!fromAccount || !toAccount) {
        console.log('❌ One or both accounts not found!');
        return false;
      }
      
      return fromAccount.transfer(toAccount, amount, `Transfer via bank`, pin);
    }
  };
}

// ============================================
// 5. DEMONSTRATION & TESTING
// ============================================

function runBankingSystemDemo() {
  console.log('='.repeat(60));
  console.log('🏦 ADVANCED BANKING SYSTEM - DEMONSTRATION');
  console.log('='.repeat(60));
  
  // Create banking system
  const bank = createBankingSystem('JavaScript Bank');
  
  console.log(`\n📍 Bank: ${bank.getBankName()}`);
  console.log(`📍 Bank ID: ${bank.getBankID()}`);
  
  // Create accounts
  console.log('\n' + '='.repeat(60));
  console.log('1. CREATING ACCOUNTS');
  console.log('='.repeat(60));
  
  const john = bank.createAccount('John Doe', 5000, 'savings', '1234');
  const jane = bank.createAccount('Jane Smith', 3000, 'checking', '5678');
  const bob = bank.createAccount('Bob Johnson', 10000, 'business', '9999');
  
  // Deposit operations
  console.log('\n' + '='.repeat(60));
  console.log('2. DEPOSIT OPERATIONS');
  console.log('='.repeat(60));
  
  john.deposit(1500, 'Salary deposit', '1234');
  jane.deposit(2000, 'Freelance payment', '5678');
  
  // Withdraw operations
  console.log('\n' + '='.repeat(60));
  console.log('3. WITHDRAWAL OPERATIONS');
  console.log('='.repeat(60));
  
  john.withdraw(500, 'ATM withdrawal', '1234');
  jane.withdraw(1000, 'Rent payment', '5678');
  
  // Try to withdraw more than balance (will fail)
  console.log('\n--- Testing insufficient funds ---');
  john.withdraw(10000, 'Large withdrawal', '1234');
  
  // Transfer operations
  console.log('\n' + '='.repeat(60));
  console.log('4. TRANSFER OPERATIONS');
  console.log('='.repeat(60));
  
  john.transfer(jane, 1000, 'Payment for services', '1234');
  bob.transfer(john, 500, 'Bonus payment', '9999');
  
  // Loan operations
  console.log('\n' + '='.repeat(60));
  console.log('5. LOAN OPERATIONS');
  console.log('='.repeat(60));
  
  john.requestLoan(8000, '1234');
  jane.requestLoan(5000, '5678');
  
  // Apply interest
  console.log('\n' + '='.repeat(60));
  console.log('6. APPLYING INTEREST');
  console.log('='.repeat(60));
  
  john.applyInterest('1234');
  jane.applyInterest('5678');
  bob.applyInterest('9999');
  
  // View account summaries
  console.log('\n' + '='.repeat(60));
  console.log('7. ACCOUNT SUMMARIES');
  console.log('='.repeat(60));
  
  const johnSummary = john.getSummary('1234');
  console.log('\n📋 John\'s Account Summary:');
  console.log(JSON.stringify(johnSummary, null, 2));
  
  const janeSummary = jane.getSummary('5678');
  console.log('\n📋 Jane\'s Account Summary:');
  console.log(JSON.stringify(janeSummary, null, 2));
  
  // Transaction history
  console.log('\n' + '='.repeat(60));
  console.log('8. TRANSACTION HISTORY');
  console.log('='.repeat(60));
  
  console.log('\n📜 John\'s Transaction History:');
  const johnHistory = john.getTransactionHistory('1234');
  johnHistory.forEach((txn, index) => {
    console.log(`\n${index + 1}. ${txn.type.toUpperCase()}`);
    console.log(`   Amount: ${formatCurrency(txn.amount)}`);
    console.log(`   Date: ${txn.timestamp}`);
    console.log(`   Description: ${txn.description || 'N/A'}`);
  });
  
  // Filter transactions
  console.log('\n--- Filtering deposits only ---');
  const deposits = john.getTransactionHistory('1234', 'deposit');
  console.log(`Total deposits: ${deposits.length}`);
  
  // Bank statistics
  console.log('\n' + '='.repeat(60));
  console.log('9. BANK STATISTICS');
  console.log('='.repeat(60));
  
  const bankStats = bank.getBankStatistics();
  console.log('\n📊 Bank Statistics:');
  console.log(JSON.stringify(bankStats, null, 2));
  
  // Search accounts
  console.log('\n' + '='.repeat(60));
  console.log('10. SEARCH ACCOUNTS');
  console.log('='.repeat(60));
  
  bank.searchAccounts('john');
  bank.searchAccounts('smith');
  
  // PIN change
  console.log('\n' + '='.repeat(60));
  console.log('11. CHANGE PIN');
  console.log('='.repeat(60));
  
  john.changePin('1234', '4321');
  
  // Try with wrong PIN
  console.log('\n--- Testing with wrong PIN ---');
  john.deposit(100, 'Test', '1234'); // This will fail
  
  // Try with correct new PIN
  console.log('\n--- Testing with correct new PIN ---');
  john.deposit(100, 'Test deposit', '4321'); // This will work
  
  // Final balance check
  console.log('\n' + '='.repeat(60));
  console.log('12. FINAL BALANCES');
  console.log('='.repeat(60));
  
  console.log(`\nJohn's balance: ${formatCurrency(john.getBalance('4321'))}`);
  console.log(`Jane's balance: ${formatCurrency(jane.getBalance('5678'))}`);
  console.log(`Bob's balance: ${formatCurrency(bob.getBalance('9999'))}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ DEMONSTRATION COMPLETE!');
  console.log('='.repeat(60));
}

// ============================================
// 6. INTERACTIVE MODE (Optional)
// ============================================

function interactiveMode() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const bank = createBankingSystem('JavaScript Bank');
  let currentAccount = null;
  
  function showMenu() {
    console.log('\n' + '='.repeat(50));
    console.log('🏦 BANKING SYSTEM MENU');
    console.log('='.repeat(50));
    console.log('1. Create Account');
    console.log('2. Login to Account');
    console.log('3. Deposit Money');
    console.log('4. Withdraw Money');
    console.log('5. Transfer Money');
    console.log('6. Request Loan');
    console.log('7. View Balance');
    console.log('8. View Transaction History');
    console.log('9. View Account Summary');
    console.log('10. Apply Interest');
    console.log('11. Search Accounts');
    console.log('12. Bank Statistics');
    console.log('0. Exit');
    console.log('='.repeat(50));
    
    rl.question('\nSelect an option: ', handleMenuChoice);
  }
  
  function handleMenuChoice(choice) {
    switch(choice) {
      case '1':
        createAccountPrompt();
        break;
      case '2':
        loginPrompt();
        break;
      case '3':
        if (checkLogin()) depositPrompt();
        break;
      case '4':
        if (checkLogin()) withdrawPrompt();
        break;
      case '5':
        if (checkLogin()) transferPrompt();
        break;
      case '6':
        if (checkLogin()) loanPrompt();
        break;
      case '7':
        if (checkLogin()) viewBalance();
        break;
      case '8':
        if (checkLogin()) viewHistory();
        break;
      case '9':
        if (checkLogin()) viewSummary();
        break;
      case '10':
        if (checkLogin()) applyInterest();
        break;
      case '11':
        searchAccountsPrompt();
        break;
      case '12':
        viewBankStats();
        break;
      case '0':
        console.log('\n👋 Thank you for using JavaScript Bank!');
        rl.close();
        return;
      default:
        console.log('❌ Invalid option!');
        showMenu();
    }
  }
  
  function checkLogin() {
    if (!currentAccount) {
      console.log('❌ Please login first!');
      showMenu();
      return false;
    }
    return true;
  }
  
  function createAccountPrompt() {
    rl.question('Enter your name: ', (name) => {
      rl.question('Initial deposit (min $100): ', (deposit) => {
        rl.question('Account type (savings/checking/business): ', (type) => {
          rl.question('Set 4-digit PIN: ', (pin) => {
            bank.createAccount(name, parseFloat(deposit), type, pin);
            showMenu();
          });
        });
      });
    });
  }
  
  function loginPrompt() {
    rl.question('Enter account number: ', (accNum) => {
      const account = bank.getAccount(accNum);
      if (account) {
        currentAccount = account;
        console.log(`✅ Logged in as ${account.getAccountHolder()}`);
      }
      showMenu();
    });
  }
  
  function depositPrompt() {
    rl.question('Enter amount: ', (amount) => {
      rl.question('Enter PIN: ', (pin) => {
        currentAccount.deposit(parseFloat(amount), 'Deposit via CLI', pin);
        showMenu();
      });
    });
  }
  
  function withdrawPrompt() {
    rl.question('Enter amount: ', (amount) => {
      rl.question('Enter PIN: ', (pin) => {
        currentAccount.withdraw(parseFloat(amount), 'Withdrawal via CLI', pin);
        showMenu();
      });
    });
  }
  
  function transferPrompt() {
    rl.question('Enter recipient account number: ', (accNum) => {
      const recipient = bank.getAccount(accNum);
      if (!recipient) {
        showMenu();
        return;
      }
      rl.question('Enter amount: ', (amount) => {
        rl.question('Enter PIN: ', (pin) => {
          currentAccount.transfer(recipient, parseFloat(amount), 'Transfer via CLI', pin);
          showMenu();
        });
      });
    });
  }
  
  function loanPrompt() {
    rl.question('Enter loan amount: ', (amount) => {
      rl.question('Enter PIN: ', (pin) => {
        currentAccount.requestLoan(parseFloat(amount), pin);
        showMenu();
      });
    });
  }
  
  function viewBalance() {
    rl.question('Enter PIN: ', (pin) => {
      const balance = currentAccount.getBalance(pin);
      if (balance !== null) {
        console.log(`\n💰 Current Balance: ${formatCurrency(balance)}`);
      }
      showMenu();
    });
  }
  
  function viewHistory() {
    rl.question('Enter PIN: ', (pin) => {
      const history = currentAccount.getTransactionHistory(pin);
      if (history) {
        console.log('\n📜 Transaction History:');
        history.forEach((txn, index) => {
          console.log(`\n${index + 1}. ${txn.type.toUpperCase()}`);
          console.log(`   Amount: ${formatCurrency(txn.amount)}`);
          console.log(`   Date: ${txn.timestamp}`);
        });
      }
      showMenu();
    });
  }
  
  function viewSummary() {
    rl.question('Enter PIN: ', (pin) => {
      const summary = currentAccount.getSummary(pin);
      if (summary) {
        console.log('\n📋 Account Summary:');
        console.log(JSON.stringify(summary, null, 2));
      }
      showMenu();
    });
  }
  
  function applyInterest() {
    rl.question('Enter PIN: ', (pin) => {
      currentAccount.applyInterest(pin);
      showMenu();
    });
  }
  
  function searchAccountsPrompt() {
    rl.question('Enter name to search: ', (name) => {
      bank.searchAccounts(name);
      showMenu();
    });
  }
  
  function viewBankStats() {
    const stats = bank.getBankStatistics();
    console.log('\n📊 Bank Statistics:');
    console.log(JSON.stringify(stats, null, 2));
    showMenu();
  }
  
  console.log('\n🎉 Welcome to Interactive Banking System!');
  showMenu();
}

// ============================================
// RUN THE APPLICATION
// ============================================

console.log('\nChoose mode:');
console.log('1. Run automated demo');
console.log('2. Interactive mode');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nEnter choice (1 or 2): ', (choice) => {
  rl.close();
  
  if (choice === '1') {
    runBankingSystemDemo();
  } else if (choice === '2') {
    interactiveMode();
  } else {
    console.log('Invalid choice! Running demo by default...');
    runBankingSystemDemo();
  }
});















































