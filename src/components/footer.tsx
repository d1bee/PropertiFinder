import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-card border-t mt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold">RENTZ.</h3>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">COMPANY</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Home interiors</Link></li>
                            <li><Link href="#" className="hover:text-primary">About us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">SERVICES</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Home interiors</Link></li>
                            <li><Link href="#" className="hover:text-primary">About us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">CONNECT WITH US</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Write to us at</Link></li>
                            <li><Link href="#" className="hover:text-primary">care@rentz.com</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
