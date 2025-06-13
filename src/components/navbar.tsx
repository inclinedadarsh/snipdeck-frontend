import { cn } from "@/lib/utils";
import { Github, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { ViewContainer } from "./ui/view-container";

const Navbar = () => {
	return (
		<nav className="mb-4">
			<ViewContainer className="flex justify-between items-center py-4 border-b border-border">
				<div className="font-semibold text-lg flex gap-2 items-center">
					<span className="px-2 py-0.5 border-border border-dashed border-2 rounded-sm">
						Snip
					</span>
					<span className="">Deck</span>
				</div>
				<div className="flex items-center gap-2">
					<Link
						href="https://github.com/inclinedadarsh/snipdeck-frontend"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							buttonVariants({
								variant: "outline",
								size: "icon",
							}),
						)}
					>
						<Github />
					</Link>
					<Link href="/" className={cn(buttonVariants())}>
						<Plus /> Create Snippet
					</Link>
				</div>
			</ViewContainer>
		</nav>
	);
};

export default Navbar;
