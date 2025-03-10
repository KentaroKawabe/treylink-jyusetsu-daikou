document.addEventListener('DOMContentLoaded', function() {
    // ローディングアニメーションの実行
    initLoadingAnimation();
    
    // 他のアニメーションの初期化（ローディング完了後に実行）
    setTimeout(() => {
        // ローディング画面を非表示
        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.add('hidden');
        
        // メインコンテンツのアニメーションを開始
        initTypingAnimation();
        initScrollAnimations();
        initParallaxEffect();
        
        // ローディング画面が完全に消えた後に削除
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }, 1500); // 1.5秒後にローディングを終了
    
    // 追加のアニメーション初期化
    initSmoothScroll();
});

// ローディングアニメーション
function initLoadingAnimation() {
    // 書類要素の取得
    const documents = document.querySelectorAll('.document');
    const organizedDoc = document.querySelector('.organized-document');
    const loadingText = document.querySelector('.loading-text');
    
    // GSAPアニメーションの設定
    const tl = gsap.timeline({delay: 0.1});
    
    // 散らばった書類が登場するアニメーション
    tl.to(documents, {
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        rotation: () => Math.random() * 20 - 10,
    });
    
    // 書類が中央に集まるアニメーション
    tl.to(documents, {
        x: 0,
        y: 0,
        scale: 0.5,
        opacity: 0.7,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.inOut'
    }, "+=0.2");
    
    // 整理された書類が登場するアニメーション
    tl.to(organizedDoc, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, "-=0.1");
    
    // 整理された書類が一度光るエフェクト
    tl.to(organizedDoc, {
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.8)',
        duration: 0.2,
        yoyo: true,
        repeat: 1
    });
    
    // ロゴテキストの表示
    tl.to(loadingText, {
        opacity: 1,
        y: -20,
        duration: 0.4,
        ease: 'power1.out'
    }, "-=0.2");
}

// 2. テキストの段階的登場アニメーション（速度を上げる）
function initTypingAnimation() {
    // タイピングアニメーションの設定
    const typingTextElements = document.querySelectorAll('.typing-text');
    
    // 各テキスト要素にタイピングアニメーションを適用（遅延を短縮）
    typingTextElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('typing');
        }, index * 1200); // 2000ms→1200msに短縮
    });
    
    // キーベネフィット要素のフェードイン（表示タイミングを早める）
    const benefits = document.querySelectorAll('.benefit-item');
    
    // 3秒後（タイピングアニメーション完了前）にベネフィットを順次表示
    setTimeout(() => {
        benefits.forEach((benefit, index) => {
            setTimeout(() => {
                gsap.to(benefit, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5, // 0.6s→0.5sに短縮
                    ease: 'back.out(1.7)'
                });
            }, index * 250); // 400ms→250msに短縮
        });
    }, 2500); // 5000ms→2500msに短縮
}

// 3 & 5. スクロールアニメーションの初期化
function initScrollAnimations() {
    // Intersection Observer の設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 要素が表示されたらアクティブクラスを追加
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // カウントアップアニメーション（数値要素の場合）
                if (entry.target.classList.contains('stat')) {
                    const numberElement = entry.target.querySelector('.stat-number');
                    if (numberElement) {
                        startCountUp(numberElement);
                    }
                }
                
                // 問題吹き出しの連鎖表示
                if (entry.target.classList.contains('bubble-sequence')) {
                    animateBubbleSequence(entry.target);
                }
                
                // 一度表示されたら監視を停止
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // 要素の20%が見えたらトリガー
        rootMargin: '0px 0px -100px 0px' // 下から100px入ったらトリガー
    });
    
    // サービス特徴のアニメーション
    const serviceFeatures = document.querySelectorAll('.service-feature');
    serviceFeatures.forEach((feature, index) => {
        // 左右交互にスライドイン
        feature.classList.add(index % 2 === 0 ? 'fade-slide-left' : 'fade-slide-right');
        feature.classList.add('animate-on-scroll');
    });
    
    // プロセスステップのアニメーション
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step) => {
        step.classList.add('zoom-in');
        step.classList.add('animate-on-scroll');
    });
    
    // CTAボタンのパルスアニメーション
    document.querySelectorAll('.btn-dark, .btn-primary').forEach(btn => {
        // IntersectionObserverでビューポートに入った時にパルスアニメーション開始
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 少し遅延させてからアニメーション開始
                    setTimeout(() => {
                        entry.target.classList.add('pulse-animation');
                    }, 1000);
                    ctaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        ctaObserver.observe(btn);
    });
    
    // 監視対象要素を指定
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// 数値のカウントアップアニメーション（整数のみに修正）
function startCountUp(element) {
    element.classList.add('counting');
    
    const targetValue = parseInt(element.getAttribute('data-count'));
    const suffix = element.textContent.replace(/[0-9.]/g, ''); // 数値以外の部分を取得
    let startValue = 0;
    const duration = 2000; // 2秒かけてカウントアップ
    const stepTime = 20; // 更新間隔（ミリ秒）
    const totalSteps = duration / stepTime;
    const stepValue = targetValue / totalSteps;
    
    const updateCounter = () => {
        startValue += stepValue;
        if (startValue < targetValue) {
            // 整数部分のみを表示（小数点以下を切り捨て）
            element.textContent = Math.floor(startValue) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue + suffix;
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// 問題吹き出しの連鎖表示アニメーション
function animateBubbleSequence(element) {
    // 連鎖表示用の遅延を計算
    const bubbles = document.querySelectorAll('.bubble-sequence');
    const index = Array.from(bubbles).indexOf(element);
    
    // 300ミリ秒ごとに表示
    setTimeout(() => {
        element.classList.add('active');
    }, index * 300);
}

// 4. パラレックス背景効果
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const parallaxBgs = document.querySelectorAll('.parallax-bg');
        
        parallaxBgs.forEach(bg => {
            // スクロール量に応じて背景をずらす
            const parentOffset = bg.parentElement.offsetTop;
            const scrollDelta = scrollPosition - parentOffset;
            
            if (scrollDelta > -window.innerHeight && scrollDelta < window.innerHeight) {
                // 視界内にある場合のみパラレックス効果を適用
                bg.style.transform = `translateY(${scrollDelta * 0.3}px)`;
            }
        });
    });
}

// スムーズスクロール機能の追加
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
} 