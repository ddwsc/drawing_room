import Nodemailer from "@/libs/nodemailer";

const mailService = Nodemailer.getInstance();

export async function sendVerifyEmail(to: string, verifyUrl: string) {
	try {
		await mailService.sendMail(
			to,
			"Fun Drawing Room Verification",
			`<p>Click the button below to verify your email:</p>
			<a href="${verifyUrl}" style="
				display: inline-block;
				padding: 6px 12px;
				font-size: 14px;
				color: white;
				background-color: #2563EB;
				text-decoration: none;
				border-radius: 8px;
			">Verify Email</a>
			`,
			`Please click the following link to verify your email: ${verifyUrl}`
		);
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error(`Error sending email to ${to}:`, error);
	}
}

export async function sendResetPassword(to: string, resetUrl: string) {
	try {
		await mailService.sendMail(
			to,
			"Fun Drawing Room Reset Password",
			`<p>Click the button below to reset your password:</p>
			<a href="${resetUrl}" style="
				display: inline-block;
				padding: 6px 12px;
				font-size: 14px;
				color: white;
				background-color: #2563EB;
				text-decoration: none;
				border-radius: 8px;
			">Reset Password</a>
			`,
			`Please click the following link to reset your password: ${resetUrl}`
		);
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error(`Error sending email to ${to}:`, error);
	}
}
