import {
  type CancellationToken,
  type ProvideHoverSignature,
  type LinesTextDocument,
  type Position,
  type ProvideSignatureHelpSignature,
  type SignatureHelpContext,
  type ResolveCompletionItemSignature,
  type CompletionItem,
} from 'coc.nvim'

export async function resolveCompletionItem(
  item: CompletionItem,
  token: CancellationToken,
  next: ResolveCompletionItemSignature,
) {
  const context = item.data?.context;
  context?.logger.info('resolveCompletionItem', item);
  const result = await next(item, token);
  if (
    result &&
    typeof result.documentation === 'object' &&
    'kind' in result.documentation &&
    result.documentation.kind === 'markdown'
  ) {
    result.documentation.value = result.documentation.value.replace(/&nbsp;/g, ' ');
    result.documentation.value += '\n SANITY CHECK 0\n';
  }
  if (result == null) {
    return result;
  }

  if (result.documentation == null) {
    result.documentation = { kind: 'markdown', value: '' };
  }

  return result;
}

export async function provideHover(
  document: LinesTextDocument,
  position: Position,
  token: CancellationToken,
  next: ProvideHoverSignature,
) {
  const hover = await next(document, position, token);
  if (hover && typeof hover.contents === 'object' && 'kind' in hover.contents && hover.contents.kind === 'markdown') {
    hover.contents.value = hover.contents.value.replace(/&nbsp;/g, ' ');
  }

  return hover;
}

export async function provideSignatureHelp(
  document: LinesTextDocument,
  position: Position,
  context: SignatureHelpContext,
  token: CancellationToken,
  next: ProvideSignatureHelpSignature,
) {
  const sign = await next(document, position, context, token);
  if (sign?.signatures.length) {
    for (const info of sign.signatures) {
      if (info.documentation && typeof info.documentation === 'object' && info.documentation.kind === 'markdown') {
        info.documentation.value = info.documentation.value.replace(/&nbsp;/g, ' ');
      }
    }
  }

    sign.signatures.push({
        label: 'SANITY CHECK',
        documentation: {
        kind: 'markdown',
        value: 'SANITY CHECK',
        },
        parameters: [],
    });
  return sign;
}
