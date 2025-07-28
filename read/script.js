document.addEventListener( "DOMContentLoaded", async () =>
{
    const urlParams = new URLSearchParams( window.location.search );
    const fileName = urlParams.get( "file" );
    const fileElement = document.getElementById( "filename" );
    const loading = document.getElementById( "loading" );
    const container = document.getElementById( "pdf-container" );

    // 验证文件名
    if ( !fileName || !/^[a-zA-Z0-9._\-]+\.pdf$/i.test( fileName ) )
    {
        showError( "无效的文件名" );
        return;
    }

    const pdfPath = `/read/pdf/${ fileName }`;
    fileElement.textContent = fileName;

    try
    {
        // 获取 PDF
        const loadingTask = pdfjsLib.getDocument( pdfPath );
        const pdf = await loadingTask.promise;
        loading.textContent = `📄 加载中... 共 ${ pdf.numPages } 页`;

        // 清空容器
        container.innerHTML = "";

        // 动态缩放：手机小一些
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );
        const baseScale = isMobile ? 0.9 : 1.3;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const renderScale = baseScale * devicePixelRatio;

        for ( let i = 1; i <= pdf.numPages; i++ )
        {
            const page = await pdf.getPage( i );

            const viewport = page.getViewport( { scale: renderScale } );
            const canvas = document.createElement( "canvas" );
            const context = canvas.getContext( "2d" );

            // 设置 canvas 宽高（物理像素）
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // CSS 尺寸（逻辑像素，避免页面过大）
            canvas.style.width = `${ viewport.width / devicePixelRatio }px`;
            canvas.style.height = `${ viewport.height / devicePixelRatio }px`;

            // 样式
            canvas.className = "page-canvas";
            canvas.style.margin = "10px auto";
            canvas.style.display = "block";
            canvas.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
            canvas.style.maxWidth = "100%";
            canvas.style.height = "auto";

            // 渲染
            await page.render( {
                canvasContext: context,
                viewport: viewport
            } ).promise;

            container.appendChild( canvas );
        }

        loading.style.display = "none";

    } catch ( error )
    {
        console.error( "PDF 加载失败:", error );
        showError( `无法加载 PDF：${ error.message }` );
    }

    function showError ( msg )
    {
        loading.style.display = "none";
        container.innerHTML = `<div class="error">❌ ${ msg }</div>`;
    }
} );