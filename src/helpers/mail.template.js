const html = (otpCode) =>
  `
<div style="font-family: Helvetica,Arial,sans-serif;min-width:100px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee;margin: 0 auto;width: max-content">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
        <img src="https://firebasestorage.googleapis.com/v0/b/fitfo-storage.appspot.com/o/avatars%2Flogo_default.png?alt=media&token=7d6ef2a3-383d-430d-a94c-89e272ae1dea"
        style="height:100px; width:100px;"/>
      </a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Fitfo. Use the following OTP to complete your Sign Up procedures. OTP is valid for 3 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otpCode}</h2>
    <p style="font-size:0.9em;">Regards,<br />Fitfo admin</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Fitfo Inc</p>
      <p>114 Chien Thang st</p>
      <p>Tan Trieu, Thanh Tri, Ha Noi</p>
    </div>
  </div>
</div>
`;

export default html;

