import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Terminal } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Experience Smarter Writing</h2>
                    <p className="mt-4 text-lg">Join the waitlist to be among the first to use our AI-powered note-taking assistant with auto-complete and contextual knowledge.</p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="gap-2">
                            <Link to="/signup">
                                <Terminal className="h-4 w-4" />
                                <span>Join Waitlist</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline">
                            <Link to="/">
                                <span>View Demo</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
