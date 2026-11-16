using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace GhazaalCloudPC;

public partial class MainWindow : Window
{
    private readonly string _profilePath = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "GhazaalCloudPC", "BrowserProfile");
    private readonly List<WebView2> _views = new();
    private const string HomeUrl = "https://www.google.com/";

    public MainWindow()
    {
        InitializeComponent();
        Loaded += async (_, _) => await AddTabAsync(HomeUrl);
    }

    private async Task AddTabAsync(string url, CoreWebView2Deferral? newWindowDeferral = null,
        CoreWebView2NewWindowRequestedEventArgs? newWindowArgs = null)
    {
        var view = new WebView2 { CreationProperties = new CoreWebView2CreationProperties { UserDataFolder = _profilePath } };
        var page = new Grid();
        page.Children.Add(view);
        var tab = new TabItem { Header = "New tab", Content = page };
        BrowserTabs.Items.Add(tab);
        BrowserTabs.SelectedItem = tab;
        _views.Add(view);

        try
        {
            await view.EnsureCoreWebView2Async();
            view.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
            view.CoreWebView2.Settings.IsStatusBarEnabled = true;
            view.CoreWebView2.Settings.AreDevToolsEnabled = true;
            view.CoreWebView2.DownloadStarting += (_, e) =>
            {
                var downloads = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
                Directory.CreateDirectory(downloads);
                e.ResultFilePath = Path.Combine(downloads, Path.GetFileName(e.ResultFilePath));
                StatusText.Text = "Downloading: " + Path.GetFileName(e.ResultFilePath);
            };
            view.CoreWebView2.DocumentTitleChanged += (_, _) =>
                Dispatcher.Invoke(() => tab.Header = ShortTitle(view.CoreWebView2.DocumentTitle));
            view.CoreWebView2.SourceChanged += (_, _) =>
                Dispatcher.Invoke(() => { if (BrowserTabs.SelectedItem == tab) AddressBox.Text = view.Source?.ToString() ?? ""; });
            view.CoreWebView2.NewWindowRequested += async (_, e) =>
            {
                e.Handled = true;
                var target = e.Uri;
                await AddTabAsync(string.IsNullOrWhiteSpace(target) ? HomeUrl : target);
            };
            view.CoreWebView2.NavigationStarting += (_, _) =>
                Dispatcher.Invoke(() => StatusText.Text = "Loading…");
            view.CoreWebView2.NavigationCompleted += (_, e) =>
                Dispatcher.Invoke(() => StatusText.Text = e.IsSuccess ? "Ready" : "Navigation failed: " + e.WebErrorStatus);
            if (newWindowArgs is not null) newWindowArgs.NewWindow = view.CoreWebView2;
            view.Source = Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
                (uri.Scheme == "http" || uri.Scheme == "https") ? uri : new Uri(HomeUrl);
        }
        catch (Exception ex)
        {
            StatusText.Text = "WebView2 could not start: " + ex.Message;
            MessageBox.Show("Microsoft Edge WebView2 Runtime is required. Install or update the Evergreen Runtime, then reopen the app.\n\n" + ex.Message,
                "Browser runtime missing", MessageBoxButton.OK, MessageBoxImage.Warning);
        }
        finally { newWindowDeferral?.Complete(); }
    }

    private static string ShortTitle(string? title) =>
        string.IsNullOrWhiteSpace(title) ? "New tab" : title.Length > 22 ? title[..22] + "…" : title;

    private WebView2? CurrentView => (BrowserTabs.SelectedItem as TabItem)?.Content is Grid g
        ? g.Children.OfType<WebView2>().FirstOrDefault() : null;

    private void BrowserTabs_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (AddressBox is null) return;
        AddressBox.Text = CurrentView?.Source?.ToString() ?? "";
        BackButton.IsEnabled = CurrentView?.CanGoBack == true;
        ForwardButton.IsEnabled = CurrentView?.CanGoForward == true;
    }

    private void Navigate()
    {
        var text = AddressBox.Text.Trim();
        if (string.IsNullOrWhiteSpace(text)) return;
        if (!text.Contains("://") && text.Contains('.') && !text.Contains(' ')) text = "https://" + text;
        else if (!text.Contains("://")) text = "https://www.google.com/search?q=" + Uri.EscapeDataString(text);
        if (Uri.TryCreate(text, UriKind.Absolute, out var uri) && (uri.Scheme == "https" || uri.Scheme == "http"))
            CurrentView?.Navigate(uri.ToString());
    }

    private void Go_Click(object sender, RoutedEventArgs e) => Navigate();
    private void AddressBox_KeyDown(object sender, KeyEventArgs e) { if (e.Key == Key.Enter) Navigate(); }
    private void Back_Click(object sender, RoutedEventArgs e) { if (CurrentView?.CanGoBack == true) CurrentView.GoBack(); }
    private void Forward_Click(object sender, RoutedEventArgs e) { if (CurrentView?.CanGoForward == true) CurrentView.GoForward(); }
    private void Reload_Click(object sender, RoutedEventArgs e) => CurrentView?.Reload();
    private void Home_Click(object sender, RoutedEventArgs e) { if (CurrentView is not null) CurrentView.Source = new Uri(HomeUrl); }
    private async void NewTab_Click(object sender, RoutedEventArgs e) => await AddTabAsync(HomeUrl);
}
