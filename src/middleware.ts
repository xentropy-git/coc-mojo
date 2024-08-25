import {
  type CancellationToken,
  type ProvideHoverSignature,
  type LinesTextDocument,
  type Position,
  type ProvideSignatureHelpSignature,
  type SignatureHelpContext,
} from 'coc.nvim'


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
    const signatureHelp = await next(document, position, context, token);
    if (signatureHelp && signatureHelp.signatures.length > 0) {
        for (const signature of signatureHelp.signatures) {
            if (signature.documentation && typeof signature.documentation === 'object' && 'kind' in signature.documentation && signature.documentation.kind === 'markdown') {
                signature.documentation.value = signature.documentation.value.replace(/&nbsp;/g, ' ');
            }
        }
    }
    return signatureHelp;
}
