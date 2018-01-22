#Dein Twitterbot.
##Starten
Um den Bot zu starten muss node-js installiert sein. 
Dann kann der Bot über die Kommandozeile mit "node bot.js" gestartet werden.

##PersistentStorage
Damit der Bot keine alten Beiträge nochmal liken will, wird die Id des letzten verarbeiteten Tweets als "since_id" gespeichert und nur neuere Tweets werden bei der nächsten Verarbeitung abgerufen.
Diese Einstellung wird in der Datei persistenstorage gespeichert.