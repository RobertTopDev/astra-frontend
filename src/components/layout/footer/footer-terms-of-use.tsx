import React from 'react'
import styles from './footer.module.scss'
import clsx from 'clsx'

const FooterTermsOfUse = () => {
  return (
    <div id="terms-of-use" className="font-extralight">
      <h2 className={clsx(styles['sub-title'])}>ASTRA DAO TERMS OF USE</h2>
      <p className={clsx(styles['sub-text'], 'text-justify')}>
        Astra DAO is a decentralized system. By using it, you agree to the
        following terms. If you don’t agree with all these terms, don’t use the
        Astra DAO system. Also, you may not use Astra DAO if you are under 18
        years of age, if you live in a jurisdiction sanctioned by United Nations
        sanctions, or if there are any legal or regulatory restrictions in your
        home jurisdiction that prevent you from using ASTRA DAO.
      </p>
      <p className={clsx(styles['sub-text'], 'text-justify')}>
        <b>Beta stage:</b> At the current time Astra DAO is still in Beta,
        meaning that you use Astra DAO at your own risk, on an experimental
        basis, with no warranties from Astra DAO and no remedies for
        malfunctions of the Astra DAO system.
      </p>
      <p className={clsx(styles['sub-text'])}>
        Do small test transactions first, just as with any transaction with
        cryptocurrency, to make sure that the system works for you and that you
        are successful in working the system.
      </p>
      <p className={clsx(styles['sub-text'])}>
        THE LIABILITY OF ASTRA DAO TO YOU OR ANY USER IS LIMITED TO A MAXIMUM
        VALUE OF 100 SWISS FRANCS.
      </p>
      <p className={clsx(styles['sub-text'])}>
        You may submit suggestions and problem reports to Astra DAO at the
        following address:&nbsp;
        <a className={clsx(styles['mail-link'])} href="mailto:dao@astradao.org">
          dao@astradao.org
        </a>
      </p>
      <p className={clsx(styles['sub-text'])}>
        ASTRA DAO DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED,
        INCLUDING WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
        PURPOSE.
      </p>
      <p className={clsx(styles['sub-text'])}>
        Forbidden activities. Astra DAO users may not:
      </p>
      <p className={clsx(styles['sub-text'], 'flex flex-wrap flex-col')}>
        <span>
          • Violate any law of your home jurisdiction or any other applicable
          jurisdiction.
        </span>
        <span>
          • Use another person’s account on ASTRA DAO without their permission.
        </span>
        <span>
          • Send advertisements or solicitations of any nature using ASTRA DAO.
        </span>
        <span>
          • Create or send any harmful, malicious, or illegal content over the
          ASTRA DAO system.
        </span>
        <span>• Inject or use any viruses or spyware.</span>
        <span>
          • Hack or attempt to alter any aspect of the Astra DAO system
        </span>
        <span>
          • Disclose other persons’ confidential or personal information.
        </span>
        <span>
          • Disable or circumvent any access restrictions in the Astra DAO
          system.
        </span>
        <span>• Use a false identity or impersonate any other person.</span>
      </p>
    </div>
  )
}

export { FooterTermsOfUse }
