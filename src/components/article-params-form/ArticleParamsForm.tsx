import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
	ArticleStateType,
	OptionType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	onApply: (newArticleState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentArticleState,
	onApply,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] =
		useState<ArticleStateType>(currentArticleState);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setFormState(currentArticleState);
	}, [currentArticleState]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				event.target instanceof Node &&
				!rootRef.current?.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const handleChange =
		(field: keyof ArticleStateType) => (value: OptionType) => {
			setFormState((prevState) => ({
				...prevState,
				[field]: value,
			}));
		};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onApply(formState);
	};

	const handleReset = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	return (
		<div ref={rootRef}>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<div className={styles.content}>
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
						<div className={styles.fields}>
							<Select
								title='Шрифт'
								selected={formState.fontFamilyOption}
								options={fontFamilyOptions}
								onChange={handleChange('fontFamilyOption')}
							/>
							<RadioGroup
								title='Размер шрифта'
								name='radio'
								options={fontSizeOptions}
								selected={formState.fontSizeOption}
								onChange={handleChange('fontSizeOption')}
							/>
							<Select
								title='Цвет шрифта'
								selected={formState.fontColor}
								options={fontColors}
								onChange={handleChange('fontColor')}
							/>
							<Separator />
							<Select
								title='Цвет фона'
								selected={formState.backgroundColor}
								options={backgroundColors}
								onChange={handleChange('backgroundColor')}
							/>
							<Select
								title='Ширина контента'
								selected={formState.contentWidth}
								options={contentWidthArr}
								onChange={handleChange('contentWidth')}
							/>
						</div>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
