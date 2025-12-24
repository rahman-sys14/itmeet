// ============================================
// PAGE TRANSITION & LOADING SCREEN HANDLER
// ============================================

(function() {
    'use strict';

    // Configuration
    const LOADING_DURATION = 1500; // 1.5 seconds
    const TRANSITION_DELAY = 100; // Small delay before showing content

    // Get loading screen element
    const loader = document.getElementById('pageLoader');
    const body = document.body;

    // Initialize page load
    function initPageLoad() {
        // Mark body as loading
        body.classList.add('loading');
        
        // Show loading screen
        if (loader) {
            loader.classList.remove('hidden');
        }

        // Hide body content initially
        const pageContent = document.querySelector('.page-content') || document.body;
        pageContent.style.opacity = '0';
        pageContent.style.visibility = 'hidden';

        // Start loading animation
        startLoadingAnimation();

        // After loading duration, hide loader and show content
        setTimeout(() => {
            hideLoader();
            showContent();
        }, LOADING_DURATION);
    }

    // Start loading animation
    function startLoadingAnimation() {
        const progressBar = document.querySelector('.loader-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 50);
        }
    }

    // Hide loading screen
    function hideLoader() {
        if (loader) {
            loader.classList.add('hidden');
        }
        body.classList.remove('loading');
    }

    // Show page content
    function showContent() {
        const pageContent = document.querySelector('.page-content') || document.body;
        pageContent.style.opacity = '1';
        pageContent.style.visibility = 'visible';
        body.classList.add('loaded');

        // Trigger animations for sections
        animateSections();
    }

    // Animate sections on page load
    function animateSections() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Handle page navigation
    function handleNavigation(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Skip if it's an anchor link, external link, or special link
        if (!href || 
            href.startsWith('#') || 
            href.startsWith('javascript:') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            link.hasAttribute('target') ||
            link.hasAttribute('download')) {
            return;
        }

        // Skip if it's the same page
        if (href === window.location.pathname || href === window.location.href) {
            return;
        }

        // Prevent default navigation
        e.preventDefault();

        // Show loading screen
        if (loader) {
            loader.classList.remove('hidden');
        }

        // Hide current content
        const pageContent = document.querySelector('.page-content') || document.body;
        pageContent.style.opacity = '0';
        pageContent.style.transition = 'opacity 0.3s ease-out';

        // Navigate after a short delay
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageLoad);
    } else {
        initPageLoad();
    }

    // Handle navigation clicks
    document.addEventListener('click', handleNavigation);

    // Handle browser back/forward buttons
    window.addEventListener('pageshow', function(event) {
        // If page is loaded from cache, show content immediately
        if (event.persisted) {
            hideLoader();
            showContent();
        } else {
            initPageLoad();
        }
    });

    // Handle page visibility change
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && loader && !loader.classList.contains('hidden')) {
            // If page becomes visible and loader is still showing, hide it
            setTimeout(() => {
                hideLoader();
                showContent();
            }, 200);
        }
    });

})();

