import "./mainOverview.css";
import { useMemo, type ReactNode } from "react";
import { formatAmount } from "../../../utils/utils";
import { allOperations, allIncomes } from "../../../store/Store";
import type { Operation, Income } from "../../../store/Store";

type OverviewCardProps = {
	className: string;
	title: string;
	value: number;
	icon: ReactNode;
};

const OverviewCard = ({ className, title, value, icon }: OverviewCardProps) => (
	<li className={className}>
		{icon}
		<h4>{title}</h4>
		<p>{formatAmount(value)} ₽</p>
	</li>
);

const WasteIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 640 640"
		aria-hidden="true"
	>
		<path
			fill="#989ba1ff"
			d="M128 96C92.7 96 64 124.7 64 160L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 256C576 220.7 547.3 192 512 192L136 192C122.7 192 112 181.3 112 168C112 154.7 122.7 144 136 144L520 144C533.3 144 544 133.3 544 120C544 106.7 533.3 96 520 96L128 96zM480 320C497.7 320 512 334.3 512 352C512 369.7 497.7 384 480 384C462.3 384 448 369.7 448 352C448 334.3 462.3 320 480 320z"
		/>
	</svg>
);

const IncomeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 640 640"
		aria-hidden="true"
	>
		<path
			fill="#989ba1ff"
			d="M297.4 566.6C309.9 579.1 330.2 579.1 342.7 566.6L502.7 406.6C515.2 394.1 515.2 373.8 502.7 361.3C490.2 348.8 469.9 348.8 457.4 361.3L352 466.7L352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 466.7L182.6 361.3C170.1 348.8 149.8 348.8 137.3 361.3C124.8 373.8 124.8 394.1 137.3 406.6L297.3 566.6z"
		/>
	</svg>
);

const PersonIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 640 640"
		aria-hidden="true"
	>
		<path
			fill="#989ba1ff"
			d="M320 32C373 32 416 75 416 128C416 181 373 224 320 224C267 224 224 181 224 128C224 75 267 32 320 32zM80 368C80 297.9 127 236.6 197.1 203.1C222.4 244.4 268 272 320 272C375.7 272 424.1 240.3 448 194C463.8 182.7 483.1 176 504 176L523.5 176C533.9 176 541.5 185.8 539 195.9L521.9 264.2C531.8 276.6 540.1 289.9 546.3 304L568 304C581.3 304 592 314.7 592 328L592 440C592 453.3 581.3 464 568 464L528 464C511.5 486 489.5 503.6 464 514.7L464 544C464 561.7 449.7 576 432 576L399 576C384.7 576 372.2 566.5 368.2 552.8L361.1 528L278.8 528L271.7 552.8C267.8 566.5 255.3 576 241 576L208 576C190.3 576 176 561.7 176 544L176 514.7C119.5 490 80 433.6 80 368zM456 384C469.3 384 480 373.3 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 373.3 442.7 384 456 384z"
		/>
	</svg>
);

export default function MainOverview() {
	const { expenses, income, remainder } = useMemo(() => {
		const expenses = allOperations.reduce(
			(sum, op: Operation) => sum + op.amount,
			0,
		);
		const income = allIncomes.reduce((sum, inc: Income) => sum + inc.amount, 0);
		return { expenses, income, remainder: income - expenses };
	}, [allOperations, allIncomes]);

	const cards = [
		{
			className: "overview-wastes",
			title: "Расходы",
			value: expenses,
			icon: <WasteIcon />,
		},
		{
			className: "overview-income",
			title: "Доходы",
			value: income,
			icon: <IncomeIcon />,
		},
	];

	return (
		<section
			className="main-container main-overview-container"
			aria-labelledby="overview-title"
		>
			<h3 id="overview-title">Быстрый обзор</h3>

			<ul>
				{cards.map((card) => (
					<OverviewCard key={card.title} {...card} />
				))}
			</ul>

			<div>
				<PersonIcon />
				<p>
					Остаток:{" "}
					<span className="main-overview-remainder">
						{formatAmount(remainder)} ₽
					</span>
				</p>
			</div>
		</section>
	);
}
