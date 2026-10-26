export function handleAssistant(request: Request, env?: { OPENAI_API_KEY?: string; OPENAI_MODEL?: string }, context?: { clientId?: string; allowedOrigins?: string[] }): Promise<Response>;
