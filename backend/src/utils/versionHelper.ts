import axios from 'axios';
import NodeCache from 'node-cache';

interface VersionInfo {
  version: string;
  beta: boolean;
  released: string;
  expire: string;
}

interface VersionsResponse {
  currentBeta: string | null;
  currentVersion: string;
  versions: VersionInfo[];
}

// Cache de 24 horas para evitar rate limit do GitHub
const versionCache = new NodeCache({
  stdTTL: 24 * 60 * 60, // 24 horas em segundos
  checkperiod: 60 * 60 // Verifica expiração a cada hora
});

// Versão fallback caso não consiga buscar do GitHub
const FALLBACK_VERSION: [number, number, number] = [2, 3000, 1025190524];

/**
 * Função que faz GET na URL e busca qualquer posição do array
 * Retorna no formato [major, minor, patch] para WAVersion
 * Utiliza cache para evitar rate limit do GitHub
 */
export async function getVersionByIndexFromUrl(index: number = 2): Promise<[number, number, number]> {
  const cacheKey = `wa-version-${index}`;
  
  // Verifica se existe no cache
  const cachedVersion = versionCache.get<[number, number, number]>(cacheKey);
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const url = 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/versions.json';
    
    const response = await axios.get<VersionsResponse>(url, {
      timeout: 5000, // Timeout de 5 segundos
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const versionsData = response.data;

    if (!versionsData.versions || versionsData.versions.length <= index) {
      console.warn(`Array versions deve ter pelo menos ${index + 1} itens, usando versão fallback`);
      versionCache.set(cacheKey, FALLBACK_VERSION);
      return FALLBACK_VERSION;
    }

    const versionItem = versionsData.versions[index];
    
    if (!versionItem || !versionItem.version) {
      console.warn(`Item na posição ${index} não encontrado ou sem versão válida, usando versão fallback`);
      versionCache.set(cacheKey, FALLBACK_VERSION);
      return FALLBACK_VERSION;
    }

    // Remove o sufixo -alpha
    const versionWithoutAlpha = versionItem.version.replace('-alpha', '');
    
    // Converte para array de números
    const [major, minor, patch] = versionWithoutAlpha.split('.').map(Number);
    
    const version: [number, number, number] = [major, minor, patch];
    
    // Armazena no cache
    versionCache.set(cacheKey, version);
    console.log(`✅ Versão WhatsApp atualizada no cache: [${major}, ${minor}, ${patch}]`);
    
    return version;
    
  } catch (error) {
    console.error('Erro ao buscar versão da URL (usando fallback):', error.message);
    
    // Se der erro (rate limit, timeout, etc), usa a versão fallback e cacheia por menos tempo (1 hora)
    versionCache.set(cacheKey, FALLBACK_VERSION, 60 * 60); // Cache de 1 hora em caso de erro
    return FALLBACK_VERSION;
  }
}

// Exemplo de uso:
/*
async function exemploUso() {
  try {
    // Busca o terceiro item da URL e retorna [major, minor, patch]
    const version = await getVersionByIndexFromUrl(2);
    console.log(version); // Retorna: [2, 3000, 1022842143]
    
    // Pode ser usado diretamente no makeWASocket
    const wsocket = makeWASocket({
      version: version, // Tipo WAVersion: [number, number, number]
      // ... outras configurações
    });
    
  } catch (error) {
    console.error('Erro:', error);
  }
}
*/
