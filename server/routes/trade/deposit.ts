import { Request, Response } from 'express'
import { asyncWrapper } from '../../helpers'
import { Contract, ethers } from 'ethers'
import { ERC20_TOKEN_ABI, PORTFOLIO_ADDRESS, PORTFOLIO_ABI } from 'dexpools-sdk'
import { getAvailableTokenList } from '../../orderbook/getAvailableTokenList'
import { getWallet } from '../../utiles/getWallet'
import moment from 'moment'

interface DepositBody {
  privateKey: string // wallet private key
  account: string // account from private key,
  chainId: number // network chain id
  amount: number // token amount
  symbol: string // token symbol to deposit
}

const deposit = async (req: Request, res: Response): Promise<void> => {
  const { chainId, account, symbol, amount } = req.body as DepositBody

  if (!chainId || !symbol || !amount) {
    throw 'Invalid arguments'
  }

  const portfolioAddress = PORTFOLIO_ADDRESS[chainId]

  // get available toke list from the order book api which are from firebase
  const tokenList = await getAvailableTokenList(chainId)

  // get deposit token from the token's symbol
  const depositToken = tokenList.find((token) => token.symbol === symbol)
  if (!depositToken) {
    throw symbol + ' is not a available in Dexpools Trading'
  }
  const smartContractAddress = depositToken.address

  // get wallet
  const wallet = getWallet(req.body)

  // get ERC20 token smart contract
  const contract = new Contract(smartContractAddress!, ERC20_TOKEN_ABI, wallet)

  /**
   * Check deposit amount allowance
   */
  const allowance = await contract.allowance(account, portfolioAddress)
  const allowanceAmount = ethers.utils.formatUnits(
    allowance,
    depositToken.decimals
  )

  if (amount > parseFloat(allowanceAmount)) {
    // Approve deposit amount with max amount if requested amount is bigger than already allowed amount
    const allowAmount = ethers.constants.MaxUint256.toString()
    const transaction = await contract.approve(portfolioAddress, allowAmount)
    await transaction.wait()
  }

  // get portfolio contract to use for deposit
  const portfolioContract = new Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    wallet
  )

  // Deposit Token
  const requestDeposit = await portfolioContract.depositToken(
    account,
    depositToken.bytesSymbol,
    ethers.utils.parseUnits(amount.toString(), depositToken?.decimals),
    ethers.constants.AddressZero
  )
  const txnResult = await requestDeposit.wait()

  res.send({
    type: 'Deposit',
    address: account,
    txId: txnResult?.transactionHash,
    name: depositToken.name,
    symbol: depositToken?.symbol,
    amount: amount,
    status: 'Completed',
    time: moment().format('DD-MM-YYYY | hh:mm')
  })
}

export default asyncWrapper(deposit)
