/**
 * FAQ Schema Markup Generator
 * Automatically generates JSON-LD structured data for Google Rich Snippets
 */

(function() {
    'use strict';

    const generateFAQSchema = () => {
        // Find all FAQ items on the page
        const faqItems = document.querySelectorAll('.faq-item');

        if (faqItems.length === 0) return;

        const faqEntries = [];

        faqItems.forEach(item => {
            const questionElement = item.querySelector('.faq-question h3');
            const answerElement = item.querySelector('.faq-answer-content');

            if (questionElement && answerElement) {
                const question = questionElement.textContent.trim();
                const answer = answerElement.textContent.trim();

                faqEntries.push({
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer
                    }
                });
            }
        });

        // Create the FAQ schema
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqEntries
        };

        // Inject the schema into the page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(faqSchema, null, 2);
        document.head.appendChild(script);

        console.log('[FAQ Schema] Generated schema for', faqEntries.length, 'questions');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateFAQSchema);
    } else {
        generateFAQSchema();
    }
})();
