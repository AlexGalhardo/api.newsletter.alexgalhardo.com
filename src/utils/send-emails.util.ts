import fs from "fs";
import path from "path";
import prisma from "../config/prisma.config";
import resend from "../config/resend.config";
import { FRONT_END_DNS } from "./constants.util";

export const sendEmails = async () => {
	const confirmedEmails = await prisma.email.findMany({
		where: {
			confirmed_email_at: {
				not: null,
			},
		},
	});

	for (const item of confirmedEmails) {
		const htmlTemplate = fs.readFileSync("./src/emails/news.html", "utf-8");

		console.log("htmlTemplate -> ", htmlTemplate);

		const first_news =
			"O Bitcoin viu uma leve alta no valor nas últimas semanas, com analistas apontando que o interesse institucional pode estar impulsionando essa recuperação. Muitos especialistas acreditam que, apesar da volatilidade, a criptomoeda pode atingir novos recordes em breve, à medida que mais empresas adotam blockchain em suas operações.";

		const second_news =
			"A tecnologia 5G está se expandindo globalmente, oferecendo maior velocidade de internet e impulsionando inovações em áreas como inteligência artificial e automação. Empresas de telecomunicações estão investindo fortemente em infraestrutura para garantir cobertura abrangente em várias regiões.";

		const third_news =
			"A economia global enfrenta desafios em meio à inflação crescente, com governos adotando políticas fiscais mais rigorosas para controlar os preços. Especialistas alertam que o aumento nos custos de energia e alimentos pode continuar afetando as classes mais baixas nos próximos meses.";

		const fourth_news =
			"O mercado de NFTs (tokens não fungíveis) está em um momento de desaceleração, mas ainda atrai artistas e colecionadores. Apesar da queda nos preços, alguns analistas acreditam que os NFTs ainda têm um grande potencial para revolucionar os mercados de arte digital e propriedade intelectual.";

		const fifth_news =
			"As fintechs estão ganhando espaço no Brasil, com um aumento no uso de plataformas de pagamento e investimentos online. A digitalização dos serviços financeiros está permitindo maior inclusão e acesso a produtos bancários para milhões de pessoas, especialmente em áreas mais remotas.";

		const afiliado_um = `Compre o meu produto please: <a href="#">Link de afiliado</a>`;

		const afiliado_dois = `Compre o meu segundo produto também please: <a href="#">Link de afiliado dois</a>`;

		const dynamicHtml = htmlTemplate
			.replace("{{first_news}}", first_news)
			.replace("{{second_news}}", second_news)
			.replace("{{third_news}}", third_news)
			.replace("{{fourth_news}}", fourth_news)
			.replace("{{fifth_news}}", fifth_news)
			.replace("{{afiliado_um}}", afiliado_um)
			.replace("{{afiliado_dois}}", afiliado_dois)
			.replace("{{unsubscribe_url}}", `${FRONT_END_DNS}/unsubscribe`)
			.replace("{{frontend_url}}", `${FRONT_END_DNS}`);

		try {
			const response = await resend.emails.send({
				from: `news@${String(process.env.RESEND_EMAIL_FROM_DOMAIN)}`,
				to: item.email,
				subject: "Nova noticia | Noticia quente | Noticia bombastica",
				html: dynamicHtml,
			});

			console.log(`Mandou email para ${item.email} -> `, response);
		} catch (error: any) {
			throw new Error("Error sending email: ", error.message);
		}
	}
};
