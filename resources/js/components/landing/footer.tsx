import { motion } from 'framer-motion';

export function Footer() {
    return (
        <motion.footer
            className="bg-primary text-primary-foreground py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <div className="mx-auto max-w-7xl px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <span className="text-sm">
                        &copy; {new Date().getFullYear()} LearningTigers. All rights reserved.
                    </span>
                </div>
            </div>
        </motion.footer>
    );
}
