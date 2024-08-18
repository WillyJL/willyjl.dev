interface ImgProps {
	src: string;
	alt?: string;
	title?: string;
}

export function img({ src, alt, title }: ImgProps) {
	return (
		<img
			src={src}
			alt={alt}
			title={title ?? alt}
		/>
	);
}
