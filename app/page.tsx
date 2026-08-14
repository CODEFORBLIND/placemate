import Logo from "@/components/logo";

export default function Home() {
    return (
        <div className="flex flex-col gap-8 items-center justify-center min-h-screen space-x-4">
            <Logo />
            <p className="text-muted-foreground">Multi Agent Placement Cell Activity Automation Platform</p>
        </div>
    );
}
