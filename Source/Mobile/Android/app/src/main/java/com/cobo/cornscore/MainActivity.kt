///////////////////////////////////////////////////////////////////

package com.cobo.cornscore
import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.browser.customtabs.CustomTabsIntent
import android.net.Uri

///////////////////////////////////////////////////////////////////

class MainActivity : AppCompatActivity()
{
    override fun onCreate(savedInstanceState: Bundle?)
    {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.allowFileAccess = true
        webView.loadUrl("file:///android_asset/Web/index.html")

        val messageHandler = AndroidMessageHandler(this, this)
        webView.addJavascriptInterface(messageHandler, "androidMessageHandler")
        setContentView(webView)
    }
}

///////////////////////////////////////////////////////////////////

class AndroidMessageHandler(private val activity: AppCompatActivity, private val context: Context)
{
    @JavascriptInterface
    fun openInCustomTabs(url: String)
    {
        val builder = CustomTabsIntent.Builder()
        val customTabsIntent = builder.build()
        customTabsIntent.launchUrl(context, Uri.parse(url))
    }
}

///////////////////////////////////////////////////////////////////