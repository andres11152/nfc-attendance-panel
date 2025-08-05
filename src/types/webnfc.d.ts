// src/types/webnfc.d.ts

// Declaraciones mínimas para la API Web NFC si TypeScript no las encuentra automáticamente

interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
  data?: DataView; // O ArrayBuffer
  // Puedes añadir más propiedades de NDEFRecord según las necesites
}

interface NDEFReadingEvent extends Event {
  serialNumber: string; // El UID de la tarjeta NFC (comúnmente se usa para identificar la tarjeta)
  message: NDEFMessage;
}

// Interfaz para las opciones de NDEFReader.scan()
interface NDEFScanOptions {
  signal?: AbortSignal;
}

// Interfaz para NDEFReader (la clase principal para interactuar con NFC)
declare class NDEFReader {
  constructor();
  scan(options?: NDEFScanOptions): Promise<void>;
  // onreading se define como un EventListener para NDEFReadingEvent
  onreading: ((this: NDEFReader, ev: NDEFReadingEvent) => any) | null;
  onreadingerror: ((this: NDEFReader, ev: Event) => any) | null;
  write(message: NDEFMessage, options?: NDEFWriteOptions): Promise<void>;
  cancel(): Promise<void>;
}

// Interfaz para las opciones de NDEFReader.write()
interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

// Extender la interfaz Window y Navigator para que TypeScript sepa que existen estas APIs
interface Window {
  NDEFReader?: typeof NDEFReader;
}

interface Navigator {
  nfc?: object; // navigator.nfc existe para verificar compatibilidad, pero no tiene métodos directos
}