#Dein Twitterbot.
##Starten
Um den Bot zu starten muss node-js installiert sein. 
Dann kann der Bot über die Kommandozeile mit "node bot.js" gestartet werden.

##Hashtags
Um die Hashtags zu ändern, nach denen gesucht werden soll, müssen in der bot.js oben die Parameter angepasst werden.
Um einzustellen, wie viele Tweets pro Hashtag geladen werden (und dann über den Zufallsgenerator geliked werden) kann der Parameter "NumberOfResultsPerHashtag" verwendet werden. Dieser akzeptiert Zahlen zwischen 1 und 100. (Einschränkung durch die API von Twitter)

##Interval
Über den Interval in den Einstellungen kann eingestellt werden alle wie viele Stunden der Bot loslaufen soll um Tweets zu liken.

##Like-Wahrscheinlichkeit
Die Ergebnisse der Hashtag-Suche werden der Reihe nach abgearbeitet und immer mit einer definierten Wahrscheinlichkeit geliked. Die Wahrscheinlichkeit kann in den Parametern eingestellt werden. Hier gibt es einmal die "tweetLikeDefaultPropability", welche Standartmäßig verwendet wird. Zusätzlich gibt es noch das Array "tweetLikePropabilities" in dem bestimmten Bereichen eine höhere oder niedrigere Wahrscheinlichkeit zugewiesen werden kann. In der Standartkonfiguration wird beispielsweise bei Posts mit einer Like-Anzahl zwischen 3 und 33 die Wahrscheinlichkeit auf 70% erhöht.

##Like-Interval
Wie schnell die erhaltenen Tweets geliked werden, kann über die Parameter "tweetLikeIntervalMin" und "tweetLikeIntervalMax" gesteuert werden. 
Werden Tweets zum liken gefunden wird eine zufällige Anzahl von Sekunden zwischen diesen beiden Werten genommen und nach dieser Anzahl von Sekunden wird der nächste Tweet geliked.

##PersistentStorage
Damit der Bot keine alten Beiträge nochmal liken will, wird die Id des letzten verarbeiteten Tweets als "since_id" gespeichert und nur neuere Tweets werden bei der nächsten Verarbeitung abgerufen.
Diese Einstellung wird in der Datei persistenstorage gespeichert.