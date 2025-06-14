"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ViewContainer } from "@/components/ui/view-container";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import CodeMirror from "@uiw/react-codemirror";
import { Copy, Share2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type Version = {
	id: number;
	content: string;
	commit_message: string;
	version_number: number;
	created_at: string;
	updated_at: string;
};

type Snippet = {
	id: number;
	slug: string;
	title: string | null;
	language: string;
	created_at: string;
	updated_at: string;
	versions: Version[];
};

const SnippetPage = ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = use(params);
	const [snippet, setSnippet] = useState<Snippet | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedVersion, setSelectedVersion] = useState<Version | null>(
		null,
	);

	const getLanguageExtension = (lang: string) => {
		switch (lang) {
			case "javascript":
			case "typescript":
				return javascript();
			case "python":
				return python();
			case "html":
				return html();
			case "c++":
				return cpp();
			case "markdown":
				return markdown();
			case "json":
				return json();
			case "rust":
				return rust();
			case "java":
				return java();
			case "php":
				return php();
			case "sql":
				return sql();
			default:
				return [];
		}
	};

	const handleShare = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard!");
	};

	const handleCopyCode = () => {
		if (selectedVersion) {
			navigator.clipboard.writeText(selectedVersion.content);
			toast.success("Code copied to clipboard!");
		}
	};

	useEffect(() => {
		const fetchSnippet = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/snippets/${slug}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch snippet");
				}

				const data = await response.json();
				setSnippet(data);
				setSelectedVersion(data.versions[data.versions.length - 1]);
			} catch (error) {
				toast.error("Failed to fetch snippet. Please try again.");
				console.error("Error fetching snippet:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSnippet();
	}, [slug]);

	if (loading) {
		return (
			<ViewContainer>
				<div className="flex items-center justify-center h-[50vh]">
					<p className="text-lg">Loading...</p>
				</div>
			</ViewContainer>
		);
	}

	if (!snippet || !selectedVersion) {
		return (
			<ViewContainer>
				<div className="flex items-center justify-center h-[50vh]">
					<p className="text-lg">Snippet not found</p>
				</div>
			</ViewContainer>
		);
	}

	return (
		<main>
			<ViewContainer>
				<div className="space-y-6">
					<div className="flex justify-between items-start">
						<div className="space-y-2">
							{snippet.title && (
								<h1 className="font-bold text-4xl">
									{snippet.title}
								</h1>
							)}
							<div className="flex gap-4 text-sm text-muted-foreground">
								<p>Language: {snippet.language}</p>
								<p>
									Created:{" "}
									{new Date(
										snippet.created_at,
									).toLocaleDateString()}
								</p>
								<p>
									Last updated:{" "}
									{new Date(
										snippet.updated_at,
									).toLocaleDateString()}
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							onClick={handleShare}
							className="cursor-pointer"
						>
							<Share2 className="w-4 h-4 mr-2" />
							Share snippet
						</Button>
					</div>
					<div className="">
						<div className="flex justify-between items-center border-t border-r border-l px-4 pb-3 pt-2 translate-y-[4px] rounded-t-md">
							<p className="text-sm text-muted-foreground">
								{selectedVersion.commit_message}
							</p>
							<div className="flex items-center gap-4">
								<p className="text-sm text-muted-foreground">
									Created:{" "}
									{new Date(
										selectedVersion.created_at,
									).toLocaleString(undefined, {
										year: "numeric",
										month: "numeric",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
								<Button
									variant="outline"
									size="icon"
									className="cursor-pointer bg-transparent"
									onClick={handleCopyCode}
								>
									<Copy className="w-4 h-4" />
								</Button>
								<Select
									value={selectedVersion.version_number.toString()}
									onValueChange={value => {
										const version = snippet.versions.find(
											v =>
												v.version_number.toString() ===
												value,
										);
										if (version)
											setSelectedVersion(version);
									}}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select version" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{snippet.versions.map(version => (
												<SelectItem
													key={version.id}
													value={version.version_number.toString()}
												>
													Version{" "}
													{version.version_number}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="border rounded-md overflow-hidden">
							<CodeMirror
								value={selectedVersion.content}
								height="400px"
								extensions={[
									getLanguageExtension(snippet.language),
								]}
								editable={false}
								basicSetup={{
									lineNumbers: true,
									highlightActiveLineGutter: true,
									highlightSpecialChars: true,
									foldGutter: true,
									drawSelection: true,
									dropCursor: true,
									allowMultipleSelections: true,
									indentOnInput: true,
									syntaxHighlighting: true,
									bracketMatching: true,
									closeBrackets: true,
									autocompletion: true,
									rectangularSelection: true,
									crosshairCursor: true,
									highlightActiveLine: true,
									highlightSelectionMatches: true,
									closeBracketsKeymap: true,
									searchKeymap: true,
									foldKeymap: true,
									completionKeymap: true,
									lintKeymap: true,
								}}
							/>
						</div>
					</div>
				</div>
			</ViewContainer>
		</main>
	);
};

export default SnippetPage;
