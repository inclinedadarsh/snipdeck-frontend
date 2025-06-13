"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import { toast } from "sonner";

type LanguageValue =
	| "html"
	| "javascript"
	| "typescript"
	| "python"
	| "c++"
	| "markdown"
	| "json"
	| "rust"
	| "java"
	| "php"
	| "sql"
	| "txt";

type Language = {
	text: string;
	value: LanguageValue;
};

const languages: Language[] = [
	{
		text: "Plain text",
		value: "txt",
	},
	{
		text: "HTML",
		value: "html",
	},
	{
		text: "JavaScript",
		value: "javascript",
	},
	{
		text: "TypeScript",
		value: "typescript",
	},
	{
		text: "Python",
		value: "python",
	},
	{
		text: "C++",
		value: "c++",
	},
	{
		text: "Markdown",
		value: "markdown",
	},
	{
		text: "JSON",
		value: "json",
	},
	{
		text: "Rust",
		value: "rust",
	},
	{
		text: "Java",
		value: "java",
	},
	{
		text: "PHP",
		value: "php",
	},
	{
		text: "SQL",
		value: "sql",
	},
];

export default function Home() {
	const [title, setTitle] = useState("");
	const [language, setLanguage] = useState<LanguageValue>("txt");
	const [code, setCode] = useState("");
	const [commitMessage, setCommitMessage] = useState("Initial Commit");
	const [loading, setLoading] = useState(false);

	const getLanguageExtension = (lang: LanguageValue) => {
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

	const handleSubmit = async () => {
		// Validate required fields
		if (!code.trim()) {
			toast.error("Code snippet cannot be empty");
			return;
		}

		if (!commitMessage.trim()) {
			toast.error("Commit message cannot be empty");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/snippets`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...(title.trim() && { title: title.trim() }),
						language,
						content: code.trim(),
						commit_message: commitMessage.trim(),
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to create snippet");
			}

			const data = await response.json();
			toast.success(`Snippet created! Slug: ${data.slug}`);
		} catch (error) {
			toast.error("Failed to create snippet. Please try again.");
			console.error("Error creating snippet:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="">
			<ViewContainer className="">
				<h1 className="font-bold text-4xl my-8">
					Create a new snippet!
				</h1>
				<div className="space-y-6">
					<div className="flex gap-4 flex-col sm:flex-row">
						<div className="space-y-2 w-full">
							<Label htmlFor="title">Title (optional)</Label>
							<Input
								id="title"
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
						</div>
						<div className="space-y-2 w-full">
							<Label>Language</Label>
							<Select
								value={language}
								onValueChange={(value: LanguageValue) =>
									setLanguage(value)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a language" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{languages.map(lang => (
											<SelectItem
												key={lang.value}
												value={lang.value}
											>
												{lang.text}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Code snippet</Label>
						<div className=" border rounded-md overflow-hidden">
							<CodeMirror
								value={code}
								height="400px"
								extensions={[getLanguageExtension(language)]}
								onChange={value => setCode(value)}
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
					<div className="flex gap-4 items-end flex-col md:flex-row">
						<div className="space-y-2 w-full">
							<Label htmlFor="commit">Commit message</Label>
							<Input
								id="commit"
								value={commitMessage}
								onChange={e => setCommitMessage(e.target.value)}
							/>
						</div>
						<Button
							className="cursor-pointer min-w-[300px]"
							disabled={loading}
							onClick={handleSubmit}
						>
							{loading ? "Creating..." : "Create snippet!"}
						</Button>
					</div>
				</div>
			</ViewContainer>
		</main>
	);
}
