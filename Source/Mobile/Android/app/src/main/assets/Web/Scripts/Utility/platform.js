///////////////////////////////////////////////////////////////////

let Platforms = 
{
    iOS: "iOS",
    Android: "Android",
    Web: "Web"
}

///////////////////////////////////////////////////////////////////

function getCurrentPlatform()
{
    if(navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad"))
    {
        return Platforms.iOS;
    }
    else if(navigator.userAgent.includes("Android"))
    {
        return Platforms.Android;
    }
    else
    {
        return Platforms.Web;
    }
}

///////////////////////////////////////////////////////////////////

function isPlatformMobile()
{
    if(navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("Android"))
    {
        return true;
    }
    else
    {
        return false;
    }
}

///////////////////////////////////////////////////////////////////

function isPlatformWeb()
{
    if(isPlatformMobile())
    {
        return false;
    }
    else
    {
        return true;
    }
}

///////////////////////////////////////////////////////////////////