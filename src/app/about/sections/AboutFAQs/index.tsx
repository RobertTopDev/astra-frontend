'use client'
import { AstraHeader, AstraLink } from '@/components'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn'
import React from 'react'
import './about-faqs.module.scss'

const AboutFAQs = () => {
  return (
    <div className="relative z-20 container w-full pb-20">
      <div className="relative sm:mt-0 mt-10 w-full flex flex-col justify-center items-center gap-6">
        <AstraHeader>FAQs</AstraHeader>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent className="text-justify">
                {faq.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

const faqs = [
  {
    title: 'How Does Astra DAO Work?',
    content: (
      <div>
        Astra DAO is an Arbitrum-based automated asset allocation platform built
        for Web3 investors. Through a tokenized index participation marketplace,
        Astra DAO seeks to transfer advanced crypto investment strategies to a
        global population of investors.
        <br />
        <br />
        To learn how Astra DAO manages this&nbsp;
        <AstraLink link="https://mirror.xyz/0x0035BAb3c7Ab6EbdB9501f0C0cE4FC7C83A447A4/Ear9ZKioVE9TWpTFCOV_GopzKhQfF7ApSShk0uAWK7g">
          see here
        </AstraLink>
      </div>
    ),
  },
  {
    title: 'What Problem Does ASTRA DAO Solve?',
    content: (
      <div>
        <div>
          ASTRA DAO’s goal is to help retail investors compete with investment
          funds by providing winning strategies through free-market competition.
          From a high level, ASTRA DAO solves two issues that place retail
          crypto investors at a disadvantage:
        </div>
        <ol>
          <li className="list-decimal">
            Investors lack the resources to adequately research large numbers of
            crypto assets.
          </li>
          <li className="list-decimal">
            Investors find balancing a diversified portfolio complicated and
            expensive.&nbsp;
          </li>
        </ol>
        <div>
          ASTRA DAO remedies these issues through its decentralized index
          participation marketplace.
        </div>
      </div>
    ),
  },
  {
    title: 'What Is ASTRA DAO Token?',
    content: (
      <div>
        The Astra DAO balances incentives between network participants through
        three ERC20 tokens – ASTRA DAO tokens (ASTRA DAO), Index Participation
        Units (iTokens), and Liquidity Provision tokens (LPs).
        <br />
        <br />
        The ASTRA DAO token is the central currency of the marketplace and
        governance ecosystem. ASTRA DAO tokens are used for utility access and
        as a means of reward, collateral, voting power, and staking rights.
      </div>
    ),
  },
  {
    title: 'How To Earn Through ASTRA DAO?',
    content: (
      <div>
        Token holders earn by participating in indices, or by staking ASTRA DAO,
        iTokens, or LP tokens.
        <br />
        <br />
        Separately, index creators can earn ASTRA DAO through platform fee
        revenue, which comes from index participation performance fees and
        early-exit fees.
        <br />
        <br />
        To learn how to earn through ASTRA DAO,&nbsp;
        <AstraLink link="https://mirror.xyz/0x0035BAb3c7Ab6EbdB9501f0C0cE4FC7C83A447A4/sUL7jan4hHpXCuVozjw1eQVOjnPQ4CPV9jq5nGVKUVY">
          see here
        </AstraLink>
        .
      </div>
    ),
  },
  {
    title: 'What Are iTokens?',
    content: (
      <div>
        Indices on ASTRA DAO are accessible through the purchase and sale of
        Index Participation Units (iTokens). iTokens are non-transferrable ERC20
        standard tokens used to calculate a holder’s share in an index’s value.
        <br />
        <br />
        iTokens are valued through their connection to index portfolios, where
        each iToken is proportional to a holder’s percentage share in an index.
        If an index grows, so too does the value of its corresponding iTokens.
        <br />
        <br />
        To learn more about iTokens and ASTRA DAO indices, see here.
      </div>
    ),
  },
  {
    title: 'How Is iToken Distribution Determined?',
    content: (
      <div>
        iTokens are purchasable through ETH, DAI, USDT, and USDC. The exact
        amount of iTokens, a user receives is calculated based on the ratio of
        their capital allocation to the entire index value.
        <br />
        <br />
        To learn more about iTokens distribution, see section 4.3 of the Astra
        whitepaper here.
      </div>
    ),
  },
  {
    title: 'How To Create an Astra Index?',
    content: (
      <div>
        All Astra DAO users maintain the ability to create indices on Astra
        DAO’s decentralized marketplace. Index creators earn through platform
        performance fees and early-exit fees. Creators need to pay 5,000,000,000
        Astra DAO tokens to create an index. To learn how to create and profit
        from Astra DAO Indices,&nbsp;
        <AstraLink link="https://www.youtube.com/watch?v=nt3nekmhduI">
          see here
        </AstraLink>
        .
      </div>
    ),
  },
  {
    title: 'Does Astra DAO Charge Fees?',
    content: (
      <div>
        <div>
          There are several fees used in the Astra DAO ecosystem: the
          performance fee, early exit fee, Astra DAO ecosystem fee, and slashing
          Fee.&nbsp;
        </div>
        <ul>
          <li className="list-decimal">
            Performance Fee: Performance fees are automatically collected upon
            iToken redemption if the investor&apos;s ROI exceeds 0. If an
            investor withdraws only a portion of iTokens held, performance fees
            will automatically adjust to the ratio of tokens withdrawn to total
            tokens held. The performance fee is currently fixed at 20% of the
            individual investor’s profit but can be adjusted by the DAO
            governance vote.
          </li>
          <li className="list-decimal">
            Early-Exit Fee: Early exit fees prevent or discourage investors from
            redeeming index participation units shortly after buying them. The
            early exit fee is designed to be high at the beginning (2%) and
            gradually decrease (1/182 of the initial fee daily). After six
            months of consecutive holding, the exit fee is equal to zero. Users
            can exempt themselves from early exit fees by converting them to
            Astra DAO token deposits with six months of lockup.&nbsp;
          </li>
          <li className="list-decimal">
            Astra DAO ecosystem fee: Index/pool creators keep 80% of performance
            and early exit fees, and 20% is transferred to Astra DAO treasury as
            an Astra DAO ecosystem fee. 80% of ecosystem fees are redistributed
            back to Astra DAO token stakers, while 20% goes to the treasury.
          </li>
          <li className="list-decimal">
            Slashing Fee: The slashing fee will start from 90% on the 1st day of
            the Astra DAO staking program and decrease 1% a day over 90 days
            until achieving 0%. If a user stakes a new ASTRA DAO before the 90th
            day, then the slashing fee will become a weighted average of the old
            and new ASTRA DAO with respect to the amount and days staked. The
            slashing fee collected is redistributed back to stakers. The
            slashing fee will start from 90% on the 1st day of the Astra DAO
            staking program and decrease by 1% a day over 90 days until
            achieving 0%. If a user stakes a new ASTRA DAO before the 90th day,
            then the slashing fee will become a weighted average of the old and
            new ASTRA DAO with respect to the amount and days staked. The
            slashing fee collected is redistributed back to stakers.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: 'What Are Liquidity Provision (LP) Tokens?',
    content: (
      <div>
        Liquidity Provision tokens are issued to liquidity providers on a
        decentralized exchange. Astra DAO users can earn yield by staking their
        LP tokens on the Astra DAO platform (also known as ‘Liquidity Mining��).
      </div>
    ),
  },
  {
    title: 'How To Stake ASTRA DAO, iTokens, Or LP Tokens?',
    content: (
      <div>
        Astra DAO’s staking protocol aims to recognize the value in long term
        holding, even if the held assets are small. To stake ASTRA DAO, iTokens,
        and LP tokens, navigate to the ‘Staking’ dashboard.
        <br />
        <br />
        ASTRA DAO tokens can be ‘locked’ for a duration of 6, 9, and 12 months
        to receive higher rewards and gain voting power. Alternatively, iTokens
        and LP tokens cannot be staked for any specific durations.
        <br />
        <br />
        To learn how to stake ASTRA DAO, iTokens, and LP tokens,&nbsp;
        <AstraLink link="https://mirror.xyz/0x0035BAb3c7Ab6EbdB9501f0C0cE4FC7C83A447A4/PHAZBIW7QOsu8HQj68wROuhnqpYAIaghlbitEsKm3yI">
          see here
        </AstraLink>
        .
      </div>
    ),
  },
  {
    title: 'How To Unstake ASTRA DAO, iTokens, And LP Tokens?',
    content: (
      <div>
        Users can not withdraw ASTRA DAO before completing 6, 9, or 12 months
        lock up. Users staked in no lock-up vault can withdraw at any point, but
        their rewards will be subject to a slashing fee if less than 90 days. A
        withdrawal from a lockup vault contract unstakes all tokens (partial
        withdrawals are impossible) and resets the user’s staking score to 0.
        <br />
        <br />
        To withdraw ASTRA DAO, iTokens, and LP tokens, users must wait through a
        one-day cool-down period to unstake their capital. Unstake and withdraw
        after the countdown time elapses. Once assets are withdrawn, the
        cooldown button will be reset, and users will need to activate the
        cool-down period again for any future withdrawals.
      </div>
    ),
  },
  {
    title: 'How Are Staking Rewards Calculated?',
    content: (
      <div>
        ASTRA DAO staking rewards are funded through platform performance fees
        and early-exit fees. Notably, 16% of each fee within the Astra DAO is
        distributed back to ASTRA DAO stakers.
        <br />
        <br />
        On Astra DAO, each user’s staking yield is determined through their
        Staking Score and applicable Reward Multipliers. The Astra DAO Staking
        Score is calculated as an average of a user&apos;s ASTRA DAO token
        holdings over the last 60 days. The Rewards Multiplier is determined by
        ASTRA DAO staking duration, or by specific iTokens or LP token details.
      </div>
    ),
  },
  {
    title: 'How To Claim ASTRA DAO Staking Rewards?',
    content: (
      <div>
        ASTRA DAO rewards earned from staking ASTRA DAO tokens are automatically
        claimed upon withdrawal. Alternatively, ASTRA DAO rewards earned from
        staking iTokens and LP must be claimed manually. These rewards are
        subject to&nbsp;
        <AstraLink link="https://docs.astradao.org/tutorials/claiming-rewards-itokens-staking-and-liquidity-mining">
          slashing
        </AstraLink>
        &nbsp; unless re-staked and locked for a minimum 90 days.&nbsp;
      </div>
    ),
  },
  {
    title: 'How To Provide Liquidity On Astra DAO?',
    content: (
      <div>
        Astra DAO users must add liquidity directly to a DEX pool to receive
        liquidity mining rewards. By providing liquidity to a DEX, users will
        automatically mint LP tokens (known as Liquidity Provision tokens) that
        are used to calculate their percentage share in a DEX’s Liquidity
        Provider rewards. These LP tokens can then be&nbsp;
        <AstraLink link="https://www.youtube.com/watch?v=iQgIlOE_QsA">
          staked
        </AstraLink>
        &nbsp; on Astra DAO to receive additional rewards.&nbsp;
      </div>
    ),
  },
  {
    title: 'What Is The ASTRA DAO Token Supply Distribution?',
    content: (
      <div>
        <div>
          To enable a decentralized ecosystem and provide appropriate
          incentives, the ASTRA DAO token adheres to the following allocation
          percentages:&nbsp;
        </div>
        <ul style={{ listStyle: 'disc' }}>
          <li className="list-disc">
            34.6% to Liquidity Mining and Community Rewards&nbsp;
          </li>
          <li className="list-disc">
            13.8% to the Growth and Community Grant fund.
          </li>
          <li className="list-disc">15.4% to Early Contributors</li>
          <li className="list-disc">10% to Early Supporters</li>
          <li className="list-disc">4.6% to Strategic Partners</li>
          <li className="list-disc">3.1% to Advisors</li>
          <li className="list-disc">3.1% to Liquidity Pools</li>
          <li className="list-disc">15.4% to Compensations</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'How Does Astra DAO Manage Governance?',
    content: (
      <div>
        ASTRA DAO token holders maintain the right to participate in the Astra
        DAO governance process.
        <br />
        <br />
        Once a proposal owner believes their proposal has a reasonable chance of
        passing, it may be officially submitted through the Governance
        Dashboard. A fee of 50,000,000 ASTRA DAO tokens must be staked to submit
        a proposal to prevent spam and ensure only important proposals are
        submitted.
        <br />
        <br />
        To learn more about Astra DAO governance, see section 6 of the&nbsp;
        <AstraLink link="/files/whitepaper.pdf">ASTRA DAO whitepaper</AstraLink>
        .
      </div>
    ),
  },
  {
    title: 'Is Astra DAO Open-Source?',
    content: (
      <div>
        All Astra DAO smart contracts are open source. Smart contract code and
        security audits have been done by Hacken, Halborn, and QuillAudits, and
        they passed with no critical or high-risk issues. Smart contract code
        and security audits have been done by Hacken, Halborn, and QuillAudits,
        and they passed with no critical or high-risk issues. Links to the audit
        reports can be found on&nbsp;
        <AstraLink link="https://github.com/astradao/astra-smart-contracts">
          Github
        </AstraLink>
        &nbsp; and&nbsp;
        <AstraLink link="https://docs.astradao.org/security/security-audits">
          Gitbook
        </AstraLink>
      </div>
    ),
  },
  {
    title: 'Wallet Connection Says ‘Wrong Network’?',
    content: (
      <div>
        To connect to Astra DAO’s smart contracts, ensure your Web3 wallet is
        connected to the Ethereum Mainnet.
      </div>
    ),
  },
  {
    title: 'Do iTokens Have A Fixed Supply?',
    content: (
      <div>
        The supply of iTokens connected to each Astra DAO index is dynamic. This
        means there are no specific hard-caps related to the supply of any
        index’s iTokens. Rather, the value of each iToken is determined through
        its representative ownership over an Astra DAO index.
      </div>
    ),
  },
] as const

export { AboutFAQs }
