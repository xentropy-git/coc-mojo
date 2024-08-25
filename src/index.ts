import { ExtensionContext, services, workspace, LanguageClient } from 'coc.nvim'

export async function activate(context: ExtensionContext): Promise<void> {
  const serverOptions = {
    command: 'mojo-lsp-server', // run jls
  }
  const clientOptions = {
    documentSelector: ['mojo', '🔥'], // the filetypes for the language server
  }
  const client = new LanguageClient(
    'coc-mojo', // the id
    'coc-mojo', // the name of the language server
    serverOptions,
    clientOptions
  )
  context.subscriptions.push(services.registLanguageClient(client))
}
