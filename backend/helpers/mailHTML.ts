export const generateEmail = async (link: string): Promise<string> => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Verify your email address</title>
    <!-- Link to Google Fonts for Roboto -->
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <style type="text/css" rel="stylesheet" media="all">
      /* Base ------------------------------ */
      *:not(br):not(tr):not(html) {
        font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        line-height: 1.4;
        background-color: #f5f7f9;
        color: #839197;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #414ef9;
      }

      /* Layout ------------------------------ */
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #f5f7f9;
      }
      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      /* Masthead ----------------------- */
      .email-masthead {
        padding: 25px 0;
        display: flex;
        margin: 0 auto;
      }
      .email-masthead_logo {
        max-width: 400px;
        border: 0;
        justify-content: center;
      }
      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #839197;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }

      /* Body ------------------------------ */
      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
        border-top: 1px solid #e7eaec;
        border-bottom: 1px solid #e7eaec;
        background-color: #ffffff;
      }
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        padding: 0;
      }
      .email-footer {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        text-align: center;
      }
      .email-footer p {
        color: #839197;
      }
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        text-align: center;
      }
      .body-sub {
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px solid #e7eaec;
      }
      .content-cell {
        padding: 35px;
      }
      .align-right {
        text-align: right;
      }

      /* Type ------------------------------ */
      h1 {
        margin-top: 0;
        color: #292e31;
        font-size: 19px;
        font-weight: bold;
        text-align: left;
      }
      h2 {
        margin-top: 0;
        color: #292e31;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }
      h3 {
        margin-top: 0;
        color: #292e31;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }
      p {
        margin-top: 0;
        color: #839197;
        font-size: 16px;
        line-height: 1.5em;
        text-align: left;
      }
      p.sub {
        font-size: 12px;
      }
      p.center {
        text-align: center;
      }

      /* Buttons ------------------------------ */
      .button {
        display: inline-block;
        width: 200px;
        border-radius: 3px;
        color: #ffffff;
        font-size: 15px;
        line-height: 45px;
        text-align: center;
        text-decoration: none;
        -webkit-text-size-adjust: none;
      }

      .button:hover {
        transform: translateY(-0.5px);
        box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.5);
      }
      .button:active {
        transform: translateY(0.5px);
      }
      .button--green {
        background-color: #28db67;
      }
      .button--red {
        background-color: #ff3665;
      }
      .button--blue {
        color: #ffffff;
        background-color: #141d4f;
        text-decoration: none;
      }

      #logo {
        display: flex;
        margin: 0 auto;
        width: 60%;
      }

      /*Media Queries ------------------------------ */
      @media only screen and (max-width: 600px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }
      }
      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table
            class="email-content"
            width="100%"
            cellpadding="0"
            cellspacing="0"
          >
            <!-- Logo -->
            <tr style="display: flex">
              <td class="email-masthead">
                <div id="logo">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/enventllege.appspot.com/o/assets%2FLogo_Cornerstone%20Connect_blue_horizontal.png?alt=media&token=ae5b5768-74ee-4582-a4d0-4f7e8b752537"
                    alt="logo ciccc-connect"
                    width="60%"
                    style="margin: 0 auto"
                    
                  />
                </div>
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="100%">
                <table
                  class="email-body_inner"
                  align="center"
                  width="570"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                      <h1>Verify your email address</h1>
                      <p>
                        Thanks for signing up for Cornerstone Connect! We're
                        excited to have you!
                      </p>
                      <!-- Action -->
                      <table
                        class="body-action"
                        align="center"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td align="center">
                            <div>
                              <a style="color:#fff; text-decoration:none;" 
                                href="${link}"
                                class="button button--blue"
                                >Verify Email</a
                              >
                            </div>
                          </td>
                        </tr>
                      </table>
                      <p>Thanks,<br />Cornerstone Connect</p>
                      <table class="body-sub">
                        <tr>
                          <td>
                            <p class="sub">
                              If you’re having trouble clicking the button, copy
                              and paste the URL below into your web browser.
                            </p>
                            <p class="sub">
                              <a style="color:"blue"; text-decoration:none;" href="${link}">Link</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table
                  class="email-footer"
                  align="center"
                  width="570"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td class="content-cell">
                      <p class="sub center">
                        If you have any problems, contact
                        <br />head.tech@ciccc.ca
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
};
