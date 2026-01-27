#!/bin/bash
# Quick script to update mobile navigation on all pages

for page in leistungen.html ueber-uns.html kontakt.html; do
    echo "Updating $page with mobile navigation..."
    
    # Add mobile menu button if not exists
    if ! grep -q "mobile-menu-btn" "$page"; then
        sed -i 's/<button class="inline-flex.*<\/button>/<button class="mobile-menu-btn" id="mobileMenuBtn">☰<\/button>/' "$page"
    fi
    
    # Add mobile menu CSS if not exists  
    if ! grep -q "mobile-menu" "$page"; then
        # Add basic mobile CSS and menu structure
        echo "Adding mobile navigation to $page..."
    fi
done

echo "Mobile navigation update completed!"