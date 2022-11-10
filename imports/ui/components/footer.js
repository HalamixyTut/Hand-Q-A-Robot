import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = () => (
  <div className="home-footer">
    <footer className="bs-docs-footer">
      <h3>
        <FormattedMessage
          id="contact"
          defaultMessage="联系我们"
        />
      </h3>
      <div className="footer-info">
        <p>
          <FormattedMessage
            id="address"
            defaultMessage="地址"
          />
          ：
          <FormattedMessage
            id="addressContent"
            defaultMessage="上海市青浦工业园区汇联路33号"
          />
        </p>
        <p>
          <FormattedMessage
            id="email"
            defaultMessage="Email"
          />
          ：
          <FormattedMessage
            id="emailHaibot"
            defaultMessage="aibot@hand-china.com"
          />
        </p>
        <p>
          <FormattedMessage
            id="seat"
            defaultMessage="座机"
          />
          ：
          <FormattedMessage
            id="seatContent"
            defaultMessage="021-67005700"
          />
        </p>
        <p>
          <FormattedMessage
            id="AiBot"
            defaultMessage="800热线"
          />
          ：
          <FormattedMessage
            id="AiBotContent"
            defaultMessage="8000000001"
          />
        </p>
      </div>
      <span>
        <FormattedMessage
          id="copyright"
          defaultMessage="版权所有 © 2018-2019 "
        />
        <b><a href="#" className="text-black">
          <FormattedMessage
            id="company"
            defaultMessage="螺钉机器人"
          />
           </a>
        </b>
        &nbsp;
        <FormattedMessage
          id="allRights"
          defaultMessage="保留全部权利"
        />
      </span>
    </footer>
  </div>
);

export default Footer;
