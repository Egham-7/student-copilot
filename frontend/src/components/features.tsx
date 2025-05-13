import { Card } from '@/components/ui/card'
import { Terminal, Layout, UserCog, Database } from 'lucide-react'

export default function FeaturesSection() {
    return (
        <section>
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card
                            className="col-span-full overflow-hidden pl-6 pt-6">
                            <Terminal className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">AI Auto-Complete</h3>
                            <p className="text-muted-foreground mt-3 max-w-xl text-balance">Experience seamless writing with AI that completes your thoughts as you type. Our intelligent auto-complete understands context, anticipates your needs, and suggests relevant completions, making note-taking and content creation effortlessly productive.</p>
                            <div className="mask-b-from-95% -ml-2 -mt-2 mr-0.5 pl-2 pt-2">
                                <div className="bg-background rounded-tl-(--radius) ring-foreground/5 relative mx-auto mt-8 h-96 overflow-hidden border border-transparent shadow ring-1">
                                    <img
                                        src="/mist/tailark-3.png"
                                        alt="AI auto-complete interface demonstration"
                                        className="object-top-left h-full object-cover"
                                    />
                                </div>
                            </div>
                        </Card>
                        <Card
                            className="p-6">
                            <Layout className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Notion-like Interface</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Enjoy a familiar, flexible workspace with blocks, drag-and-drop organization, and nested pages that adapts to your personal note-taking style.</p>
                        </Card>

                        <Card
                            className="p-6">
                            <UserCog className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Agent Editing</h3>
                            <p className="text-muted-foreground mt-3 text-balance">AI agents help refine your content by suggesting improvements, reorganizing information, and enhancing clarity while preserving your voice and intent.</p>
                        </Card>
                        <Card
                            className="p-6">
                            <Database className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Knowledge Artifacts</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Empower your AI with context pieces that serve as reference points, enriching suggestions and enabling more relevant, personalized assistance.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
